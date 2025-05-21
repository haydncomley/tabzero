import './global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import App from './App.tsx';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBoup0HrgbFVTnzuwgprypoM5qU8RWLl8U',
	authDomain: 'tabzero-ai.firebaseapp.com',
	projectId: 'tabzero-ai',
	storageBucket: 'tabzero-ai.firebasestorage.app',
	messagingSenderId: '807076403319',
	appId: '1:807076403319:web:55f9df9e966f3e48ed0e72',
	measurementId: 'G-RG1FDC43MT',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const firestore = getFirestore(app);

// Initialize React Query
export const queryClient = new QueryClient();

onAuthStateChanged(auth, async (user) => {
	queryClient.setQueryData(['user'], user);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<HashRouter>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</HashRouter>
	</React.StrictMode>,
);

// Use contextBridge
(window as any).ipcRenderer.on(
	'main-process-message',
	(_event: any, message: any) => {
		console.log(_event, message);
	},
);
