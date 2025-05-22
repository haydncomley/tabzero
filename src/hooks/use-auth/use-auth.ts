import { useMutation, useQuery } from '@tanstack/react-query';
import { signOut, signInWithCustomToken } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { auth, firestore, functions } from '../../main';
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

	const { mutateAsync: login } = useMutation({
		mutationFn: () =>
			new Promise(async (res, rej) => {
				const authTwitch = httpsCallable<{ scopes: string }, { url: string }>(
					functions,
					'authTwitch',
				);
				const { data } = await authTwitch({
					// TODO: Dynamic scopes from the lib
					scopes:
						'chat:edit+channel:manage:broadcast+moderator:manage:chat_settings+clips:edit+chat:read+moderator:manage:banned_users',
				});

				window.ipcRenderer.openExternal(data.url);

				window.ipcRenderer.on<{
					token: string;
					twitch: {
						access_token: string;
						refresh_token: string;
						scope: string[];
					};
				}>('auth', (_e, data) => {
					signInWithCustomToken(auth, data.token).then(res).catch(rej);
				});
			}),
	});

	const { mutateAsync: logout, isPending: isLoggingOut } = useMutation({
		mutationFn: async () => {
			await signOut(auth);
		},
	});

	return {
		login,
		logout,
		isLoggingOut,
		ready,
		user,
		userDetails,
		details: userDetails
			? {
					id: userDetails.providers[userDetails.provider].id,
					user_name: userDetails.providers[userDetails.provider].login,
					display_name:
						userDetails.providers[userDetails.provider].display_name,
					profile_image:
						userDetails.providers[userDetails.provider].profile_image_url,
				}
			: null,
	};
};
