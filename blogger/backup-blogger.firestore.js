const firebaseConfig = {
	apiKey: "AIzaSyA3vazbEiZaeHvr_H7s8SMtvFSwkngpukg",
	authDomain: "blogger-backup-eecdc.firebaseapp.com",
	projectId: "blogger-backup-eecdc",
	storageBucket: "blogger-backup-eecdc.appspot.com",
	messagingSenderId: "979082267623",
	appId: "1:979082267623:web:62603846b606c5fb238b42",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log(app);
