// Give the service worker access to Firebase Messaging.
// Note that you can only import script versions compatible with each other.
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase Config object.
firebase.initializeApp({
  apiKey: "AIzaSyBzj_X-2TNaZgFuANJD4FBfE1csXkUCMmk",
  authDomain: "encaja-9eaae.firebaseapp.com",
  projectId: "encaja-9eaae",
  storageBucket: "encaja-9eaae.firebasestorage.app",
  messagingSenderId: "389820655263",
  appId: "1:389820655263:web:58ae1c71fa2322bd4224aa",
  measurementId: "G-TJN62SEYH3"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'Nueva Comanda 🎙️';
  const notificationOptions = {
    body: payload.notification?.body || 'Se ha recibido una nueva comanda de voz.',
    icon: '/vite.svg',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
