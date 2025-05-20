import { useMutation, useQuery } from '@tanstack/react-query';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

import { auth } from '../../main';

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

	const { mutateAsync: login, isPending: isLoggingIn } = useMutation({
		mutationFn: async () => {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			return result.user;
		},
	});

	const { mutateAsync: logout, isPending: isLoggingOut } = useMutation({
		mutationFn: async () => {
			await signOut(auth);
		},
	});

	return {
		login,
		isLoggingIn,
		logout,
		isLoggingOut,
		user,
		ready,
	};
};
