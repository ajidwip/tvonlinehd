import { ViewChild, Component } from '@angular/core';
import { AlertController, LoadingController, NavController, Events, MenuController, Platform, Nav, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';
import { ApiProvider } from '../providers/api/api';
import moment from 'moment';
import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('mycontent') Nav: NavController;
  rootPage: any;
  public users = [];
  public user = [];
  public name = '';
  public email = '';
  public picture = '';
  public loader: any;
  public ScheduleAllActive = [];
  public lineups: any;
  public daybeforegame: any;
  public minutesbeforegame: any;
  public livestreaming: any;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public storage: Storage,
    public googleplus: GooglePlus,
    public events: Events,
    public app: App,
    private fcm: FCM,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    this.initializeApp();
    this.api.get('table/z_schedule', { params: { limit: 1, filter: "status='OPEN'" + " AND " + "date >=" + "'" + moment().format('YYYY-MM-DD') + "'", sort: "date" + " ASC " } })
      .subscribe(val => {
        this.ScheduleAllActive = val['data'];
        if (this.ScheduleAllActive.length == 0) {
          this.api.get('table/z_schedule', { params: { limit: 1, filter: "status!='VERIFIKASI'", sort: "date" + " DESC " } })
            .subscribe(val => {
              this.ScheduleAllActive = val['data'];
              if (this.ScheduleAllActive.length == 0) {
                this.app.getRootNav().setRoot('MaintenancePage')
              }
              else {
                this.rootPage = TabsPage;
                events.subscribe('user:login', (users, time) => {
                  this.users = users;
                  this.name = users[0].first_name;
                  this.email = users[0].email;
                  this.picture = users[0].image_url;
                  this.lineups = users[0].notif_lineups;
                  this.daybeforegame = users[0].notif_day;
                  this.minutesbeforegame = users[0].notif_minutes;
                  this.livestreaming = users[0].notif_livestreaming;
                  console.log(this.lineups, this.daybeforegame, this.minutesbeforegame, this.livestreaming)
                  if (this.lineups == 1) {
                    this.fcm.subscribeToTopic('lineups');
                  }
                  else {
                    this.fcm.unsubscribeFromTopic('lineups');
                  }
                  if (this.daybeforegame == 1) {
                    this.fcm.subscribeToTopic('daybeforegame');
                  }
                  else {
                    this.fcm.unsubscribeFromTopic('daybeforegame');
                  }
                  if (this.minutesbeforegame == 1) {
                    this.fcm.subscribeToTopic('minutesbeforegame');
                  }
                  else {
                    this.fcm.unsubscribeFromTopic('minutesbeforegame');
                  }
                  if (this.livestreaming == 1) {
                    this.fcm.subscribeToTopic('livestreaming');
                  }
                  else {
                    this.fcm.unsubscribeFromTopic('livestreaming');
                  }
                });
                // events.subscribe('user:logingoogle', (res, time) => {
                //   this.users = res;
                //   this.name = res[0].displayName;
                //   this.email = res[0].email;
                //   this.picture = res[0].imageUrl;
                // });
                if (this.storage.length) {
                  this.storage.get('users').then((val) => {
                    this.users = val;
                    if (this.users) {
                      this.email = val.email;
                      this.api.get('table/z_users', { params: { filter: "email=" + "'" + this.email + "'" } })
                        .subscribe(val => {
                          this.user = val['data']
                          this.name = this.user[0].first_name;
                          this.email = this.user[0].email;
                          this.picture = this.user[0].image_url;
                          this.lineups = this.user[0].notif_lineups;
                          this.daybeforegame = this.user[0].notif_day;
                          this.minutesbeforegame = this.user[0].notif_minutes;
                          this.livestreaming = this.user[0].notif_livestreaming;
                          console.log(this.lineups, this.daybeforegame, this.minutesbeforegame, this.livestreaming)
                          if (this.lineups == 1) {
                            this.fcm.subscribeToTopic('lineups');
                          }
                          else {
                            this.fcm.unsubscribeFromTopic('lineups');
                          }
                          if (this.daybeforegame == 1) {
                            this.fcm.subscribeToTopic('daybeforegame');
                          }
                          else {
                            this.fcm.unsubscribeFromTopic('daybeforegame');
                          }
                          if (this.minutesbeforegame == 1) {
                            this.fcm.subscribeToTopic('minutesbeforegame');
                          }
                          else {
                            this.fcm.unsubscribeFromTopic('minutesbeforegame');
                          }
                          if (this.livestreaming == 1) {
                            this.fcm.subscribeToTopic('livestreaming');
                          }
                          else {
                            this.fcm.unsubscribeFromTopic('livestreaming');
                          }
                        })
                    }
                  });
                }
              }
            });
        }
        else {
          this.rootPage = TabsPage;
          events.subscribe('user:login', (users, time) => {
            this.users = users;
            this.name = users[0].first_name;
            this.email = users[0].email;
            this.picture = users[0].image_url;
            this.lineups = users[0].notif_lineups;
            this.daybeforegame = users[0].notif_day;
            this.minutesbeforegame = users[0].notif_minutes;
            this.livestreaming = users[0].notif_livestreaming;
            console.log(this.lineups, this.daybeforegame, this.minutesbeforegame, this.livestreaming)
            if (this.lineups == 1) {
              this.fcm.subscribeToTopic('lineups');
            }
            else {
              this.fcm.unsubscribeFromTopic('lineups');
            }
            if (this.daybeforegame == 1) {
              this.fcm.subscribeToTopic('daybeforegame');
            }
            else {
              this.fcm.unsubscribeFromTopic('daybeforegame');
            }
            if (this.minutesbeforegame == 1) {
              this.fcm.subscribeToTopic('minutesbeforegame');
            }
            else {
              this.fcm.unsubscribeFromTopic('minutesbeforegame');
            }
            if (this.livestreaming == 1) {
              this.fcm.subscribeToTopic('livestreaming');
            }
            else {
              this.fcm.unsubscribeFromTopic('livestreaming');
            }
          });
          // events.subscribe('user:logingoogle', (res, time) => {
          //   this.users = res;
          //   this.name = res[0].displayName;
          //   this.email = res[0].email;
          //   this.picture = res[0].imageUrl;
          // });
          if (this.storage.length) {
            this.storage.get('users').then((val) => {
              this.users = val;
              if (this.users) {
                this.email = val.email;
                this.api.get('table/z_users', { params: { filter: "email=" + "'" + this.email + "'" } })
                  .subscribe(val => {
                    this.user = val['data']
                    this.name = this.user[0].first_name;
                    this.email = this.user[0].email;
                    this.picture = this.user[0].image_url;
                    this.lineups = this.user[0].notif_lineups;
                    this.daybeforegame = this.user[0].notif_day;
                    this.minutesbeforegame = this.user[0].notif_minutes;
                    this.livestreaming = this.user[0].notif_livestreaming;
                    console.log(this.lineups, this.daybeforegame, this.minutesbeforegame, this.livestreaming)
                    if (this.lineups == 1) {
                      this.fcm.subscribeToTopic('lineups');
                    }
                    else {
                      this.fcm.unsubscribeFromTopic('lineups');
                    }
                    if (this.daybeforegame == 1) {
                      this.fcm.subscribeToTopic('daybeforegame');
                    }
                    else {
                      this.fcm.unsubscribeFromTopic('daybeforegame');
                    }
                    if (this.minutesbeforegame == 1) {
                      this.fcm.subscribeToTopic('minutesbeforegame');
                    }
                    else {
                      this.fcm.unsubscribeFromTopic('minutesbeforegame');
                    }
                    if (this.livestreaming == 1) {
                      this.fcm.subscribeToTopic('livestreaming');
                    }
                    else {
                      this.fcm.unsubscribeFromTopic('livestreaming');
                    }
                  })
              }
            });
          }
        }
      }, err => {
        this.app.getRootNav().setRoot('MaintenancePage')
      });
    this.fcm.getToken().then(token => {
      this.storage.set('tokennotification', token);
      let date = moment().format('YYYY-MM-DD h:mm:ss');
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
      this.api.post("table/token_notification",
        {
          "token": token,
          "date": date
        },
        { headers })
        .subscribe()
      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {

        } else {
          let alert = this.alertCtrl.create({
            subTitle: data.title,
            message: data.body,
            buttons: ['OK']
          });
          alert.present();
        };
      });
    }, (e) => {
    });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  doLogin() {
    this.app.getRootNav().setRoot('LoginPage')
    this.menuCtrl.close();
  }
  doLogout() {
    this.users = [];
    this.name = '';
    this.email = '';
    this.picture = '';
    this.storage.remove('users')
    this.app.getRootNav().setRoot(TabsPage);
  }
  doHome() {
    this.app.getRootNav().setRoot(TabsPage);
    this.menuCtrl.close();
  }
  doGoToPage(pageName) {
    this.app.getRootNav().setRoot(pageName)
    this.menuCtrl.close();
  }
  doChat() {
    if (this.name) {
      this.app.getRootNav().setRoot('ChatPage');
      this.menuCtrl.close();
    }
    else {
      this.app.getRootNav().setRoot('LoginPage')
      this.menuCtrl.close();
    }
  }
  doSettings() {
    if (this.email != "") {
      this.app.getRootNav().setRoot('SettingsPage');
      this.menuCtrl.close();
    }
    else {
      this.app.getRootNav().setRoot('LoginPage')
      this.menuCtrl.close();
    }
  }

}

