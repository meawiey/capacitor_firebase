import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { initializeApp } from "firebase/app";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber, getAuth, onAuthStateChanged } from 'firebase/auth'
import { query as realtimeQuery, ref, get, onValue, child, getDatabase } from "firebase/database";
import { auth } from '../services/firebase';
import { firebaseConfig } from '../../environments/environment.prod';
import {
  AlertOptions,
  LoadingOptions,
  ModalOptions,
  PopoverOptions,
} from '@ionic/core';

import {
  AlertController,
  LoadingController,
  ModalController,
  PopoverController,
} from '@ionic/angular';

import { FirebaseAuthenticationService } from '../services/capacitor-firebase-authenication';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public phoneNumber: string = "";
  public otp: string = "";
  public verificationId: any;
  public recaptchaVerifier: RecaptchaVerifier | undefined;
  public resultOTP: ConfirmationResult | undefined;

  public userFirebase: any = null;

  constructor(private platform: Platform,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private firebaseAuthenticationService: FirebaseAuthenticationService) {
    this.userFirebase = {
      uid: "",
      accessToken: ""
    }
    // this.initSitesSearch();

  }

  // initSitesSearch() {
  //   return new Promise<any>(async (resolve, reject) => {
  //     try {
  //       const app = initializeApp(firebaseConfig);
  //       const database = getDatabase(app);
  //       const database_ref = ref(database, '/client/siteSearch');
  //       const snapshot = await get(database_ref);
  //     } catch (err) {
  //       reject(err)
  //     }

  //   });
  // }

  async callVerifyPhoneNumber() {
    let tel = "+66" + this.phoneNumber.replace(/\D[^\.]/g, '').slice(1);
    console.log('tel ', tel);
    if (this.platform.is('android')) {
      console.log('platform android');
      this.verifyPhoneNumber(tel);
    } else {
      console.log('platform else');
      this.verifyPhoneNumber(tel);
      // try {
      //   await this._bs.verifyPhoneNumber(tel);
      //   this.nativeAccessService.dismissLoading();
      //   this.goToOTP();
      // } catch (error) {
      //   this.nativeAccessService.dismissLoading();
      //   const alert = await this.alertController.create({
      //     mode: 'ios',
      //     header: 'ไม่สามารถส่ง otp ได้',
      //     message: error ? error as string : '',
      //     buttons: [
      //       {
      //         text: 'ตกลง',
      //         handler: () => {
      //         }
      //       }
      //     ]
      //   });
      //   await alert.present();
      // }
    }

  }

  async verifyPhoneNumber(phoneNumber: any) {
    console.log('verifyPhoneNumber', phoneNumber);
    if (this.recaptchaVerifier == undefined) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        'size': 'invisible',
        'callback': (response: any) => {
          console.log(response);
        },
      })
    }
    await signInWithPhoneNumber(auth, phoneNumber, this.recaptchaVerifier)
      .then(confirmationResult => {
        this.resultOTP = confirmationResult;
      })
      .catch((error) => {
        console.error("SMS not sent ", error);
      });
  }

  validateOTP() {
    if (this.platform.is('android')) {

    } else {
      this.confirmOTP(this.otp);
    }

  }

  confirmOTP(otp: any) {

    return new Promise<any>(async (resolve, reject) => {
      this.resultOTP?.confirm(otp)
        .then((result: any) => {
          console.log('[confirmOTPWithAndroid] result', result);

          // return result;
          resolve(result);
        }).catch((error: any) => {
          // return error;
          reject(error);
        });
    });
  }

  getUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
       this.userFirebase = user;
       console.log('userFirebase ', this.userFirebase);
        // ...
      } else {
        // User is signed out
        // ...
        this.userFirebase = "none"
      }
    });
  }

  public async signInWithPhoneNumber(): Promise<void> {
    console.log('wiey signInWithPhoneNumber ');
    let loadingElement: HTMLIonLoadingElement | undefined;
    try {
      const phoneNumber = this.phoneNumber;
      if (!phoneNumber) {
        return;
      }
      loadingElement = await this.showLoading();
      await this.firebaseAuthenticationService.signInWithPhoneNumber({
        phoneNumber,
      });
      await loadingElement?.dismiss();
    } finally {
      await loadingElement?.dismiss();
    }
  }

  private async showInputPhoneNumberAlert(): Promise<string | undefined> {
    const data = await this.showInputAlert({
      inputs: [
        {
          name: 'phoneNumber',
          type: 'text',
          placeholder: 'Phone Number',
        },
      ],
    });
    if (!data) {
      return;
    }
    return data.phoneNumber;
  }

  public async showInputAlert(opts?: AlertOptions): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      const defaultOpts: AlertOptions = {
        header: 'Input',
        inputs: [],
        buttons: [
          {
            text: 'Cancel',
            handler: (data) => {
              resolve(data);
            },
          },
          {
            text: 'Submit',
            handler: (data) => {
              resolve(data);
            },
          },
        ],
      };
      opts = { ...defaultOpts, ...opts };
      this.showAlert(opts);
    });
    return promise;
  }

  public async showLoading(
    opts?: LoadingOptions
  ): Promise<HTMLIonLoadingElement> {
    const defaultOpts: LoadingOptions = {
      message: 'Loading...',
    };
    opts = { ...defaultOpts, ...opts };
    const loading = await this.loadingCtrl.create(opts);
    await loading.present();
    return loading;
  }

  public async showAlert(opts?: AlertOptions): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
    return alert;
  }
}
