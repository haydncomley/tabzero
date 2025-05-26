import { HttpsError, onCall, onRequest } from 'firebase-functions/https';
import { firestore, stripeKey, stripePriceId, stripeWebhookSecret } from '../config';
import { tabzeroUser } from './types';
import { getStripe } from '../vendor/stripe.vendor';

export const stripeWebhook = onRequest({ secrets: [stripeKey] }, async (request, response) => {
	const sig = request.headers['stripe-signature'];
	let event;
	const stripe = getStripe();

	if (!sig)
		throw new HttpsError('invalid-argument', 'Missing stripe-signature header');

	try {
		event = stripe.webhooks.constructEvent(
			request.rawBody,
			sig,
			stripeWebhookSecret.value(),
		);
	} catch (err) {
		console.error(err);
		throw new HttpsError('invalid-argument', 'Webhook error');
	}

	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object;
			const { subscription, customer } = session;
			// find user by customer ID
			const users = await firestore
				.collection('users')
				.where('stripe_customer_id', '==', customer)
				.get();

			if (!users.empty) {
				await users.docs[0].ref.update({
					stripe_subscription_id: subscription,
					stripe_subscription_status: 'active',
				});
			}
			break;
		}
		case 'customer.subscription.deleted': {
			const invoice = event.data.object;
			const customerId = invoice.customer;
			// find user by subscription ID
			const users = await firestore
				.collection('users')
				.where('stripe_customer_id', '==', customerId)
				.get();

			if (!users.empty) {
				await users.docs[0].ref.update({
					stripe_subscription_status: 'inactive',
				});
			}
			break;
		}
	}

	response.status(200).send({ received: true });
});

export const stripeCheckout = onCall({ secrets: [stripeKey, stripePriceId] }, async (request) => {
	if (!request.auth)
		throw new HttpsError('unauthenticated', 'User must be authenticated');

	const stripe = getStripe();

	const userRef = firestore.collection('users').doc(request.auth.uid);
	const doc = await userRef.get();
	const user = doc.data() as tabzeroUser;
	let customerId = user.stripe_customer_id;

	if (!customerId) {
		const customer = await stripe.customers.create({
			metadata: { uid: request.auth.uid },
		});
		customerId = customer.id;
		await userRef.update({ stripe_customer_id: customerId });
	}

	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		payment_method_types: ['card'],
		customer: customerId,
		line_items: [{ price: stripePriceId.value(), quantity: 1 }],
		success_url: `https://tabzero.gg/success`,
		cancel_url: `https://tabzero.gg/cancel`,
	});

	return { sessionId: session.id, sessionUrl: session.url };
});

export const stripeCancel = onCall({ secrets: [stripeKey] }, async (request) => {
	if (!request.auth)
		throw new HttpsError('unauthenticated', 'User must be authenticated');

	const stripe = getStripe();
	const userRef = firestore.collection('users').doc(request.auth.uid);
	const doc = await userRef.get();
	const user = doc.data() as tabzeroUser;
	const { stripe_subscription_id } = user;
	if (!stripe_subscription_id)
		throw new HttpsError('failed-precondition', 'No active subscription');

	await stripe.subscriptions.update(stripe_subscription_id, {
		cancel_at_period_end: true,
	});
	await userRef.update({ stripe_subscription_status: 'active-canceled' });
	return { canceled: true };
});

export const stripeResume = onCall({ secrets: [stripeKey] }, async (request) => {
	if (!request.auth)
		throw new HttpsError('unauthenticated', 'User must be authenticated');

	const stripe = getStripe();
	const userRef = firestore.collection('users').doc(request.auth.uid);
	const doc = await userRef.get();
	const user = doc.data() as tabzeroUser;
	const { stripe_subscription_id, stripe_subscription_status } = user;

	if (!stripe_subscription_id)
		throw new HttpsError('failed-precondition', 'No active subscription');

	if (stripe_subscription_status !== 'active-canceled')
		throw new HttpsError('failed-precondition', 'Subscription is not canceled');

	await stripe.subscriptions.update(stripe_subscription_id, {
		cancel_at_period_end: false,
	});

	await userRef.update({ stripe_subscription_status: 'active' });
	return { canceled: false };
});
