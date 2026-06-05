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

// Force service worker to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Send message to all open window clients to play the notification sound
  const clientsPromise = self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
    for (const client of clientList) {
      client.postMessage({ type: 'PLAY_SOUND' });
    }
  });

  // Check the settings cache to see if background notifications are enabled
  return caches.open('settings-cache')
    .then((cache) => cache.match('/background-notifications-enabled'))
    .then((response) => response ? response.text() : 'true')
    .then((state) => {
      const isEnabled = state === 'true';

      if (isEnabled && payload.data) {
        const title = payload.data.title || 'Nueva Comanda de Voz 🎙️';
        const body = payload.data.body || payload.data.comandaNote || 'Se ha creado una nueva comanda de voz.';
        const iconPath = payload.data.icon || '/logo.png';
        const iconUrl = new URL(iconPath, self.location.origin).href;

        const notificationPromise = self.registration.showNotification(title, {
          body: body,
          icon: iconUrl,
          badge: iconUrl,
          tag: payload.data.saleId || 'voice_comanda',
          data: payload.data
        });

        // Return Promise.all so the browser knows we showed the notification and avoids displaying a fallback/duplicate
        return Promise.all([clientsPromise, notificationPromise]);
      }

      return clientsPromise;
    });
});

// Handle notification clicks: focus window and send navigation command to client
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked: ', event.notification.data);
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Find if there is an active client window open and focus it
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          // Tell the client to navigate to the Cocina view
          client.postMessage({ type: 'NAVIGATE', view: 'cocina' });
          return;
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow('/').then((client) => {
          if (client) {
            // Wait a bit for react app to mount, then send message (handled gracefully by App.tsx)
            setTimeout(() => {
              client.postMessage({ type: 'NAVIGATE', view: 'cocina' });
            }, 2000);
          }
        });
      }
    })
  );
});
