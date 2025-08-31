import { initializeApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { browser } from '$app/environment';

const firebaseConfig = {
	apiKey: 'AIzaSyCXz9s13_3XwU5W3NXWMAyg1G8bfojYBVQ',
	authDomain: 'photolab-fbec1.firebaseapp.com',
	projectId: 'photolab-fbec1',
	storageBucket: 'photolab-fbec1.firebasestorage.app',
	messagingSenderId: '171691680752',
	appId: '1:171691680752:web:7d5e43215bd6c2039db335',
	measurementId: 'G-FFWCP3EETE'
};

const app = initializeApp(firebaseConfig);

let analytics: Analytics | null = null;

if (browser) {
	analytics = getAnalytics(app);
}

export { app, analytics };
