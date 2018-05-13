import { Component } from '@angular/core';
import { IonicPage, LoadingController, Events, ViewController, App, AlertController, NavController, NavParams } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularfire2';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../../pages/tabs/tabs';
import { HomePage } from '../home/home';
import { ApiProvider } from '../../providers/api/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { HttpHeaders } from "@angular/common/http";
import moment from 'moment';
import { Md5 } from 'ts-md5/dist/md5';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  myForm: FormGroup;
  myFormLogin: FormGroup;
  myFormReset: FormGroup;
  myFormGetReset: FormGroup;
  myFormSubmitReset: FormGroup;
  displayName: any;
  email: any;
  familyName: any;
  givenName: any;
  userId: any;
  imageUrl: any;
  idToken: any;
  private nextno = '';
  private uuid = '';
  public users = [];
  public googleakun = [];
  public regional = [];
  public listquestion = [];
  public usersreset = [];
  public loader: any;
  public id = '';
  public answer = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public googleplus: GooglePlus,
    public alertCtrl: AlertController,
    private storage: Storage,
    public appCtrl: App,
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    public api: ApiProvider,
    public app: App,
    public loadingCtrl: LoadingController,
    public events: Events) {
    this.doRegional();
    this.doListQuestion();
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present();
    this.myFormLogin = fb.group({
      email: ['', [Validators.compose([Validators.required]), Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', Validators.compose([Validators.required])],
    })
    this.myForm = fb.group({
      email: ['', [Validators.compose([Validators.required]), Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', Validators.compose([Validators.required])],
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      phonenumber: ['', [Validators.compose([Validators.required]), Validators.minLength(10)]],
      region: ['', Validators.compose([Validators.required])],
      listquestion: ['', Validators.compose([Validators.required])],
      keypassword: ['', Validators.compose([Validators.required])],
    })
    this.myFormReset = fb.group({
      question: ['', Validators.compose([Validators.required])],
      answer: ['', Validators.compose([Validators.required])],
    })
    this.myFormGetReset = fb.group({
      email: ['', Validators.compose([Validators.required])],
    })
    this.myFormSubmitReset = fb.group({
      password: ['', Validators.compose([Validators.required])],
      confirmpassword: ['', Validators.compose([Validators.required])],
    })
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doRegional() {
    this.api.get('table/z_regional', { params: { sort: "regional" + " ASC " } })
      .subscribe(val => {
        this.regional = val['data'];
      });
  }
  doListQuestion() {
    this.api.get('table/z_list_question', { params: { sort: "list" + " ASC " } })
      .subscribe(val => {
        this.listquestion = val['data'];
      });
  }
  doRegister() {
    document.getElementById('header').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'block';
  }
  doCloseRegister() {
    document.getElementById('header').style.display = 'block';
    document.getElementById('login').style.display = 'block';
    document.getElementById('register').style.display = 'none';
  }
  doGetLogin() {
    let password = Md5.hashStr(this.myFormLogin.value.password);
    this.api.get('table/z_users', {
      params: {
        filter: "email=" + "'" + this.myFormLogin.value.email + "'" +
          " AND " + "password=" + "'" + password + "'" + " AND " + "type=" + 0
      }
    })
      .subscribe(val => {
        this.users = val['data']
        if (this.users.length != 0) {
          this.storage.set('users', {
            id: this.users[0].id,
            name: this.users[0].first_name,
            email: this.users[0].email,
            picture: this.users[0].image_url
          });
          this.events.publish('user:login', this.users, Date.now());
          this.app.getRootNav().setRoot(TabsPage);
        }
        else {
          let alert = this.alertCtrl.create({
            subTitle: 'Error',
            message: 'The email or password you entered is incorrect',
            buttons: ['OK']
          });
          alert.present();
          this.myFormLogin.get('password').setValue('')
        }
      }, (err) => {
      });
  }
  doPostRegister() {
    this.api.get('table/z_users', { params: { filter: "email=" + "'" + this.myForm.value.email + "'" } })
      .subscribe(val => {
        this.users = val['data'];
        if (this.users.length == 0) {
          this.getNextNo().subscribe(val => {
            this.nextno = val['nextno'];
            let uuid = UUID.UUID();
            this.uuid = uuid;
            let password = Md5.hashStr(this.myForm.value.password)
            let passwordkey = Md5.hashStr(this.myForm.value.keypassword);
            const headers = new HttpHeaders()
              .set("Content-Type", "application/json");
            this.api.post("table/z_users",
              {
                "id": this.nextno,
                "email": this.myForm.value.email,
                "password": password,
                "first_name": this.myForm.value.firstname,
                "last_name": this.myForm.value.lastname,
                "gender": this.myForm.value.gender,
                "phone_number": this.myForm.value.phonenumber,
                "region": this.myForm.value.region,
                "question_key": this.myForm.value.listquestion,
                "password_key": passwordkey,
                "image_url": 'assets/imgs/people.png',
                "type": 0,
                "date_create": moment().format('YYYY-MM-DD h:mm:ss'),
                "uuid": this.uuid
              },
              { headers })
              .subscribe(val => {
                this.myForm.reset();
                this.doCloseRegister();
                let alert = this.alertCtrl.create({
                  subTitle: 'Success',
                  message: 'Registration success',
                  buttons: ['OK']
                });
                alert.present();
              }, (err) => {
                let alert = this.alertCtrl.create({
                  subTitle: 'Error',
                  message: 'Registration error',
                  buttons: ['OK']
                });
                alert.present();
              })
          });
        }
        else {
          let alert = this.alertCtrl.create({
            subTitle: 'Error',
            message: 'Email Address is Already Registered',
            buttons: ['OK']
          });
          alert.present();
          this.myFormLogin.get('email').setValue(this.myForm.value.email);
          this.doCloseRegister()
        }
      })
  }
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  showHide(password) {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  doLoginGoogle() {
    this.googleplus.login({
      'webClientId': '798397482932-8go91dakhnar8c88plcl1nv2k8c7dg00.apps.googleusercontent.com',
      'offline': true
    }).then(res => {
      this.events.publish('user:logingoogle', res, Date.now());
      // this.displayName = res.displayName;
      // this.email = res.email;
      // this.familyName = res.familyName;
      // this.givenName = res.givenName;
      // this.userId = res.userId;
      // this.imageUrl = res.imageUrl;
      // this.idToken = res.idToken;
      this.api.get('table/z_users', {
        params: {
          filter: "email=" + "'" + res.email + "'" +
            " AND " + "type=" + 1
        }
      }).subscribe(val => {
        this.googleakun = val['data'];
        if (this.googleakun.length != 0) {
          this.app.getRootNav().setRoot(TabsPage);
        }
        else {
          this.getNextNo().subscribe(val => {
            this.nextno = val['nextno'];
            this.storage.set('users', {
              id: this.nextno,
              name: res.givenName,
              email: res.email,
              picture: res.imageUrl
            });
            let uuid = UUID.UUID();
            this.uuid = uuid;
            const headers = new HttpHeaders()
              .set("Content-Type", "application/json");
            this.api.post("table/z_users",
              {
                "id": this.nextno,
                "email": res.email,
                "first_name": res.givenName,
                "last_name": res.familyName,
                "password": 'GOOGLE',
                "image_url": res.imageUrl,
                "type": 1,
                "date_create": moment().format('YYYY-MM-DD h:mm:ss'),
                "uuid": this.uuid
              },
              { headers })
              .subscribe(val => {
                this.app.getRootNav().setRoot(TabsPage);
              })
          });
        }
      })
    }).catch(err => {
      let alert = this.alertCtrl.create({
        subTitle: 'Login Gagal',
        buttons: ['OK']
      });
      alert.present();
    });
  }
  /*logout() {
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
  getNextNo() {
    return this.api.get('nextno/z_users/id')
  }
  doResetGetPassword() {
    document.getElementById('header').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('getresetpassword').style.display = 'block';
  }
  doCloseGetResetPassword() {
    document.getElementById('header').style.display = 'block';
    document.getElementById('login').style.display = 'block';
    document.getElementById('getresetpassword').style.display = 'none';
    this.myFormGetReset.reset();
  }
  doGetResetPassword() {
    this.api.get('table/z_users', { params: { filter: "email=" + "'" + this.myFormGetReset.value.email + "'" } })
      .subscribe(val => {
        this.usersreset = val['data'];
        if (this.usersreset.length != 0) {
          document.getElementById('header').style.display = 'none';
          document.getElementById('login').style.display = 'none';
          document.getElementById('getresetpassword').style.display = 'none';
          document.getElementById('forgotpassword').style.display = 'block';
          this.myFormReset.get('question').setValue(this.usersreset[0].question_key);
          this.answer = this.usersreset[0].password_key;
          this.id = this.usersreset[0].id;
        }
        else {
          let alert = this.alertCtrl.create({
            subTitle: 'Email not found',
            buttons: ['OK']
          });
          alert.present();
        }
      });
  }
  doCloseResetPassword() {
    document.getElementById('header').style.display = 'block';
    document.getElementById('login').style.display = 'block';
    document.getElementById('getresetpassword').style.display = 'none';
    document.getElementById('forgotpassword').style.display = 'none';
    this.myFormReset.reset()
  }
  doResetPassword() {
    let passwordkey = Md5.hashStr(this.myFormReset.value.answer);
    console.log(passwordkey)
    if (this.answer == passwordkey) {
      document.getElementById('header').style.display = 'none';
      document.getElementById('login').style.display = 'none';
      document.getElementById('getresetpassword').style.display = 'none';
      document.getElementById('forgotpassword').style.display = 'none';
      document.getElementById('submitreset').style.display = 'block';
    }
    else {
      let alert = this.alertCtrl.create({
        subTitle: 'Answer wrong',
        buttons: ['OK']
      });
      alert.present();
      this.myFormReset.get('answer').setValue('')
    }
  }
  doCloseSubmitReset() {
    document.getElementById('header').style.display = 'block';
    document.getElementById('login').style.display = 'block';
    document.getElementById('getresetpassword').style.display = 'none';
    document.getElementById('forgotpassword').style.display = 'none';
    document.getElementById('submitreset').style.display = 'none';
    this.myFormGetReset.reset();
    this.myFormReset.reset();
    this.myFormReset.reset();
    this.id = '';
    this.answer = '';
  }
  doSubmitResetPassword() {
    if (this.myFormSubmitReset.value.password == this.myFormSubmitReset.value.confirmpassword) {
      let password = Md5.hashStr(this.myFormSubmitReset.value.password);
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
      this.api.put("table/z_users",
        {
          "id": this.id,
          "password": password,
        },
        { headers })
        .subscribe(val => {
          let alert = this.alertCtrl.create({
            subTitle: 'Reset Password Success',
            buttons: ['OK']
          });
          alert.present();
          this.doCloseSubmitReset();
        })
    }
    else {
      let alert = this.alertCtrl.create({
        subTitle: 'Confirm password does not match',
        buttons: ['OK']
      });
      alert.present();
    }
  }
}
