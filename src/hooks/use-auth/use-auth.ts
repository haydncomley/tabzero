import { useMutation, useQuery } from '@tanstack/react-query';
import { signOut, signInWithCustomToken } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { auth, firestore, functions, queryClient } from '../../main';
import { userConverter } from './lib/converters';

export const useAuth = () => {
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

	const { data: userDetails } = useQuery({
		queryKey: ['user', user?.uid],
		queryFn: async () => {
			if (!user?.uid) return null;

			const userRef = doc(firestore, 'users', user.uid).withConverter(
				userConverter,
			);
			const userSnap = await getDoc(userRef);
			return userSnap.exists() ? userSnap.data() : null;
		},
		initialData: null,
		enabled: !!user?.uid,
	});

	// const { data: apiVersion } = useQuery({
	// 	queryKey: ['apiVersion'],
	// 	queryFn: async () => {
	// 		const version = await httpsCallable<void, { version: string }>(
	// 			functions,
	// 			'metaVersion',
	// 		);
	// 		return (await version()).data.version;
	// 	},
	// 	initialData: null,
	// 	enabled: !!user?.uid,
	// });

	const { mutateAsync: login, isPending: isLoggingIn } = useMutation({
		mutationFn: () =>
			new Promise(async (res, rej) => {
				const authTwitch = httpsCallable<void, { url: string }>(
					functions,
					'authTwitch',
				);
				const { data } = await authTwitch();

				window.ipcRenderer.openExternal(data.url);

				window.ipcRenderer.on<{
					code: string;
					scope: string;
				}>('auth', async (_e, { code }) => {
					const authTwitchCallback = httpsCallable<
						{ code: string },
						{ token: string; twitch: any }
					>(functions, 'authTwitchCallback');
					const { data } = await authTwitchCallback({ code });

					if (!data.token || !data.twitch) {
						rej('token and twitch not found');
						return;
					}

					signInWithCustomToken(auth, data.token).then(res).catch(rej);
				});
			}),
	});

	const { mutateAsync: logout, isPending: isLoggingOut } = useMutation({
		mutationFn: async () => {
			await signOut(auth);
		},
	});

	const { mutateAsync: subscribe, isPending: isSubscribing } = useMutation({
		mutationFn: async () => {
			const stripeSubscribe = httpsCallable<
				void,
				{ sessionId: string; sessionUrl: string }
			>(functions, 'stripeCheckout');
			const { data } = await stripeSubscribe();
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
			queryClient.invalidateQueries({ queryKey: ['user'] });
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
				}
			: null,
		subscribe,
		isSubscribing,
		cancel,
		isCancelling,
		apiVersion: '0.0.1',
	};
};
