import { Component } from '@angular/core';
import { initializeApp } from "firebase/app";
import { app, auth } from "./services/firebase";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken, initializeAuth, indexedDBLocalPersistence } from "firebase/auth";
import 'firebase/firestore';

import { firebaseConfig } from '../environments/environment.prod';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public user: any;
  public authCurrent: any

  constructor() {
    this.loginFirebase();
  }

  loginFirebase() {
    console.log('wiey [ConnectionService] loginFirebase');
    return new Promise<any>(async (resolve, reject) => {
      try {
        const firebaseApp = initializeApp(firebaseConfig);
        if (Capacitor.isNativePlatform()) {
          this.authCurrent = auth
        } else {
          this.authCurrent = getAuth(firebaseApp);
        }
        // this.firestore = getFirestore(app);

        
        onAuthStateChanged(this.authCurrent, (user) => {
          if (user) {
            this.user = user;
            console.log('wiey login current user ', user);
            resolve(this.user);
          } else {
            signInAnonymously(this.authCurrent)
              .then(() => {
                onAuthStateChanged(this.authCurrent, (user1) => {
                  if (user1) {
                    this.user = user1;
                    console.log('wiey login new user ', user1);
                    resolve(this.user);
                  }
                });
              })
              .catch((error) => {
                console.log('wiey error ', error);
                const errorCode = error.code;
                const errorMessage = error.message;
                // ...
              });

          }
        });
      } catch (error) {
        console.error('wiey loginFirebase error: ', error);
      }
    });
  }
}
