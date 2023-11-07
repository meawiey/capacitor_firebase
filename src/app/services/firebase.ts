import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, indexedDBLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase, ref } from "firebase/database";
import { firebaseConfig } from '../../environments/environment';

// import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence
});

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
