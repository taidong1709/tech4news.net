let firebaseConfig = {
    apiKey: "AIzaSyCPvyXwNTOJT3BAq2ttm1GSvhtB6cP2DzY",
    authDomain: "tech4news-62139.firebaseapp.com",
    databaseURL: "https://tech4news-62139-default-rtdb.firebaseio.com",
    projectId: "tech4news-62139",
    storageBucket: "tech4news-62139.appspot.com",
    messagingSenderId: "88606297930",
    appId: "1:88606297930:web:12cee1849967d106d27bb3",
    measurementId: "G-00975HM4BK"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

window.loginProvider = {
    google: new firebase.auth.GoogleAuthProvider()
}
firebase.auth().languageCode = 'vi';

window.execLogout = async function logout() {
    await firebase.auth().signOut();
}