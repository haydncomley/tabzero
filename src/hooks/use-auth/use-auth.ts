import { useMutation, useQuery } from '@tanstack/react-query';
import { signOut, signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

import { auth, functions } from '../../main';
import { useSetting } from '../use-setting';
import { useDocSnapshot } from '../use-snapshot';
import type { tabzeroUser } from './lib/types';

export const codeToToken = async (code: string) => {
	const authTwitchCallback = httpsCallable<
		{ code: string },
		{ token: string; twitch: any }
	>(functions, 'authTwitchCallback');
	const { data } = await authTwitchCallback({ code });
	return data.token;
};

export const useAuth = () => {
	const [referral] = useSetting('referral');
	const { data: ready } = useQuery({
		queryKey: ['ready'],
		queryFn: async () => {
			await auth.authStateReady();
			return true;
		},
		initialData: false,
	});

	const { data: user } = useQuery({
		queryKey: ['user'],
		queryFn: async () => auth.currentUser,
		initialData: auth.currentUser,
	});

	const userDetails = useDocSnapshot<tabzeroUser>(
		user?.uid ? `users/${user.uid}` : undefined,
	);

	const { mutateAsync: login, isPending: isLoggingIn } = useMutation({
		mutationFn: () =>
			new Promise(async (res, rej) => {
				const authTwitch = httpsCallable<void, { url: string }>(
					functions,
					'authTwitch',
				);
				const { data } = await authTwitch();

				window.ipcRenderer.openExternal(data.url);

				window.ipcRenderer.on<
					[
						{
							code: string;
							scope: string;
						},
					]
				>('auth', async (_e, { code }) => {
					const token = await codeToToken(code);
					signInWithCustomToken(auth, token).then(res).catch(rej);
				});
			}),
	});

	const { mutateAsync: logout, isPending: isLoggingOut } = useMutation({
		mutationFn: async () => {
			await signOut(auth);
		},
	});

	const { mutateAsync: subscribe, isPending: isSubscribing } = useMutation({
		mutationFn: async ({ length }: { length: 'monthly' | 'yearly' }) => {
			const stripeSubscribe = httpsCallable<
				{ length: typeof length; ref?: string },
				{ sessionId: string; sessionUrl: string }
			>(functions, 'stripeCheckout');
			const { data } = await stripeSubscribe({
				length,
				ref: referral,
			});
			window.ipcRenderer.openExternal(data.sessionUrl);
			return data;
		},
	});

	const { mutateAsync: cancel, isPending: isCancelling } = useMutation({
		mutationFn: async () => {
			const stripeCancel = httpsCallable<void, { canceled: boolean }>(
				functions,
				'stripeCancel',
			);
			await stripeCancel();
		},
	});

	const { mutateAsync: resume, isPending: isResuming } = useMutation({
		mutationFn: async () => {
			const stripeResume = httpsCallable<void, { canceled: boolean }>(
				functions,
				'stripeResume',
			);

			try {
				const { data } = await stripeResume();
				return data;
			} catch {
				subscribe({ length: 'monthly' });
			}
		},
	});

	return {
		login,
		isLoggingIn,
		logout,
		isLoggingOut,
		ready,
		user,
		userDetails,
		details: userDetails
			? {
					uid: userDetails.uid,
					id: userDetails.providers[userDetails.provider].id,
					user_name: userDetails.providers[userDetails.provider].login,
					display_name:
						userDetails.providers[userDetails.provider].display_name,
					profile_image:
						userDetails.providers[userDetails.provider].profile_image_url,
					isSubscribed:
						userDetails.stripe_subscription_status?.startsWith('active'),
					isCancelling:
						userDetails.stripe_subscription_status === 'active-canceled',
					token: userDetails.providers[userDetails.provider].access_token,
				}
			: null,
		subscribe,
		isSubscribing,
		cancel,
		isCancelling,
		resume,
		isResuming,
	};
};
