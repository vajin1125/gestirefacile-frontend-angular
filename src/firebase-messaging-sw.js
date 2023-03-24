importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js');
 
firebase.initializeApp({
    apiKey: "AIzaSyBEOBAZVl16okhuoqZoihl7qei-jnY54vo",
	authDomain: "myrent-f9706.firebaseapp.com",
	databaseURL: "https://myrent-f9706.firebaseio.com",
	projectId: "myrent-f9706",
	storageBucket: "myrent-f9706.appspot.com",
	messagingSenderId: "1029500222664",
	appId: "1:1029500222664:web:db0cc7d38d40e52d07b9fd",
	measurementId: "G-T5FTHNJEZV"
});
 
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    /*const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    self.registration.showNotification(notificationTitle,
	  notificationOptions);*/
	  
  });