// Your code here...
const firebaseConfig = {
	apiKey: "AIzaSyDn8pd1I6H2X_ZbUE6IF_MRkWAWXvqQArs",
	authDomain: "document-downloads.firebaseapp.com",
	projectId: "document-downloads",
	storageBucket: "document-downloads.appspot.com",
	messagingSenderId: "644218564903",
	appId: "1:644218564903:web:fb179ba1a34105b405f902",
	measurementId: "G-3QC6WMQ5C9",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const params = new URLSearchParams(window.location.search);

const collectionId = "scribd-vpdfs-ids-ero";
const documents$ = db.collection("scribd-vpdfs-ids-ero");
const usersId = "scribd-users-ero";
const users$ = db.collection("scribd-users-ero");
