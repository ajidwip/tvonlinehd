import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularfire2';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  password: any;
  displayName: any;
  email: any;
  familyName: any;
  givenName: any;
  userId: any;
  imageUrl: any;
  idToken: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public googleplus: GooglePlus,
    public alertCtrl: AlertController,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  showHide(password) {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    this.password = password;
  }
  doLoginGoogle() {
    this.googleplus.login({
      'webClientId': '798397482932-8go91dakhnar8c88plcl1nv2k8c7dg00.apps.googleusercontent.com',
      'offline': true
    }).then(res => {
      this.displayName = res.displayName;
      this.email = res.email;
      this.familyName = res.familyName;
      this.givenName = res.givenName;
      this.userId = res.userId;
      this.imageUrl = res.imageUrl;
      this.idToken = res.idToken;
      this.storage.set('token', {
        name: res.displayName,
        email: res.email,
        picture: res.imageUrl
      });
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then(suc => {
          let alert = this.alertCtrl.create({
            subTitle: 'Login Sukses',
            buttons: ['OK']
          });
          alert.present();
        }).catch(ns => {
          let alert = this.alertCtrl.create({
            subTitle: 'Login Gagal',
            buttons: ['OK']
          });
          alert.present();
        })
    })
  }
  /*login() {
    this.googleplus.login({})
      .then(res => {
        console.log(res);
        this.displayName = res.displayName;
        this.email = res.email;
        this.familyName = res.familyName;
        this.givenName = res.givenName;
        this.userId = res.userId;
        this.imageUrl = res.imageUrl;
      })
      .catch(err => console.error(err));
  }
  logout() {
    this.googleplus.logout()
      .then(res => {
        console.log(res);
        this.displayName = "";
        this.email = "";
        this.familyName = "";
        this.givenName = "";
        this.userId = "";
        this.imageUrl = "";
      })
      .catch(err => console.error(err));
  }*/
}
