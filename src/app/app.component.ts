import { ViewChild, Component } from '@angular/core';
import { AlertController, LoadingController, NavController, Events, MenuController, Platform, Nav, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../providers/api/api';
import { HomePage } from '../pages/home/home';
import moment from 'moment';
import { AppVersion } from '@ionic-native/app-version';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('mycontent') Nav: NavController;
  rootPage: any = HomePage;
  public pages = [];
  public subs = [];
  public subsdetail = [];
  public radiostream: boolean;
  public category: any;
  public id: any;
  public url: any;
  showLevel1 = null;
  statusapp = [];
  public datecurrent: any;
  public datetimecurrent: any;
  public versionNumber: any;
  public packagename: any;
  public appinfo = [];
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public events: Events,
    public app: App,
    public api: ApiProvider,
    public appVersion: AppVersion,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    this.initializeApp();
    this.datecurrent = moment().format('YYYY-MM-DD');
    this.datetimecurrent = moment().format('YYYY-MM-DD hh:mm');
    this.appVersion.getVersionNumber().then((version) => {
      this.versionNumber = version;
      this.appVersion.getPackageName().then((name) => {
        this.packagename = name;
        this.api.get("table/z_version", { params: { filter: "name=" + "'" + this.packagename + "'" } })
          .subscribe(val => {
            this.appinfo = val['data']
            if (this.appinfo.length) {
              if (this.appinfo[0].version > this.versionNumber) {
                let alert = this.alertCtrl.create({
                  subTitle: 'Update version',
                  message: this.appinfo[0].description,
                  buttons: [
                    {
                      text: 'PLAYSTORE',
                      handler: () => {
                        window.location.href = this.appinfo[0].url
                        this.platform.exitApp();
                      }
                    }
                  ]
                });
                alert.present();
              }
              else {
                this.api.get("table/z_status_app", { params: { filter: "status=" + 1, limit: 500 } })
                  .subscribe(val => {
                    this.statusapp = val['data']
                    if (this.statusapp.length) {
                      if (this.statusapp[0].type == '0') {
                        let alert = this.alertCtrl.create({
                          title: 'Attention',
                          message: this.statusapp[0].description,
                          buttons: [
                            {
                              text: 'Close',
                              handler: () => {
                                this.platform.exitApp();
                              }
                            }
                          ]
                        });
                        alert.present();
                      }
                      else if (this.statusapp[0].type == '1') {
                        let alert = this.alertCtrl.create({
                          title: 'Beri Rating dan Komentar',
                          message: this.statusapp[0].description,
                          buttons: [
                            {
                              text: 'TIDAK SEKARANG',
                              handler: () => {

                              }
                            },
                            {
                              text: 'YA, BERI RATING',
                              handler: () => {
                                this.appVersion.getPackageName().then((name) => {
                                  this.packagename = name;
                                  this.api.get("table/z_version", { params: { filter: "name=" + "'" + this.packagename + "'" } })
                                    .subscribe(val => {
                                      this.appinfo = val['data']
                                      if (this.appinfo.length) {
                                        window.location.href = this.appinfo[0].url
                                      }
                                    });
                                }, err => {

                                });
                              }
                            }
                          ]
                        });
                        alert.present();
                      }
                      else {
                        let alert = this.alertCtrl.create({
                          title: 'Attention',
                          message: this.statusapp[0].description,
                          buttons: [
                            {
                              text: 'Close',
                              handler: () => {

                              }
                            }
                          ]
                        });
                        alert.present();
                      }
                    }
                  });
              }
            }
          });
      })
    }, (err) => {

    })
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleDefault();
    });
  }
  doRate() {
    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_version", { params: { filter: "name=" + "'" + this.packagename + "'" } })
        .subscribe(val => {
          this.appinfo = val['data']
          if (this.appinfo.length) {
            window.location.href = this.appinfo[0].url
          }
        });
    }, err => {

    });
  }
  doChannel() {
    this.Nav.push('ListchannelPage')
    this.menuCtrl.close();
  }
  doGotoLive() {
    this.Nav.push('SchedulelivePage')
    this.menuCtrl.close();
  }
  doGotoSports() {
    this.Nav.push('SportslivePage', {
      param: '0'
    })
    this.menuCtrl.close();
  }
  doGotoSportsLive() {
    this.Nav.push('SportslivePage', {
      param: '1'
    })
    this.menuCtrl.close();
  }
  doGoToChannel() {
    this.Nav.push('NewupdateinfoPage', {
      param: '0'
    })
    this.menuCtrl.close();
  }
  doGoToStream() {
    this.Nav.push('NewupdateinfoPage', {
      param: '1'
    })
    this.menuCtrl.close();
  }
  doGoToAnime() {
    this.Nav.push('NewupdateinfoPage', {
      param: '2'
    })
    this.menuCtrl.close();
  }
  doComment() {
    this.Nav.push('CommentPage', {
      param: '0'
    })
    this.menuCtrl.close();
  }
  doRequest() {
    this.Nav.push('CommentPage', {
      param: '1'
    })
    this.menuCtrl.close();
  }
}

