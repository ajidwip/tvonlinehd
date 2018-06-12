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
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.datecurrent = moment().format('YYYY-MM-DD');
      this.datetimecurrent = moment().format('YYYY-MM-DD hh:mm');
      this.api.get("table/z_list_channel", { params: { filter: "status='OPEN' AND category != 'STREAM'", limit: 500, sort: "name" + " ASC " } })
        .subscribe(val => {
          this.pages = val['data']
        });
      this.appVersion.getVersionNumber().then((version) => {
        this.versionNumber = version;
        this.appVersion.getPackageName().then((name) => {
          this.packagename = name;
          this.api.get("table/z_version", { params: { filter: "name=" + "'" + this.packagename + "'" } })
            .subscribe(val => {
              this.appinfo = val['data']
              if (this.appinfo.length) {
                if (this.appinfo[0].version != this.versionNumber) {
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
                    });
                }
              }
            });
        })
      }, (err)=> {

      })
    });
  }
  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };
  toggleLevel1(idx, p) {
    this.subs = [];
    this.category = p.category;
    if (p.category == 'TV') {
      this.api.get("table/z_channel", { params: { limit: 500, filter: "name=" + "'" + p.name + "' AND status='OPEN'", sort: "title" + " ASC " } })
        .subscribe(val => {
          this.subs = val['data']
        });
    }
    else if (p.category == 'LIVE') {
      this.api.get("table/z_channel_live", { params: { limit: 500, filter: "category=" + "'" + p.name + "' AND status='OPEN'" + " AND date >=" + "'" + this.datecurrent + "'", group: "date", sort: "date" + " ASC " } })
        .subscribe(val => {
          this.subs = val['data'];
        });
      this.api.get("table/z_channel_live", { params: { limit: 500, filter: "category=" + "'" + p.name + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "date" + " ASC " } })
        .subscribe(val => {
          this.subsdetail = val['data'];
        });
    }
    else if (p.category == 'RADIO') {
      this.api.get("table/z_channel_radio", { params: { limit: 500, filter: "status='OPEN'", sort: "title" + " ASC " } })
        .subscribe(val => {
          this.subs = val['data']
        });
    }
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  };
  doPlay(s) {
    if (s.type == 'STREAM') {
      this.Nav.push('ChanneldetailPage', {
        anime: s.title
      })
      this.menuCtrl.close();
    }
    else if (s.type == 'RADIO') {
      this.radiostream = this.radiostream ? false : true;
      this.id = s.id;
      this.url = s.url;
    }
    else {
      this.Nav.push('LivePage', {
        url: s.url
      })
      this.menuCtrl.close();
    }
  }
  doPlayLive(sd) {
    if (sd.url) {
      this.Nav.push('LivePage', {
        url: sd.url
      })
      this.menuCtrl.close();
    }
    else {
      let alert = this.alertCtrl.create({
        subTitle: 'Coming Soon',
        buttons: ['OK']
      });
      alert.present();
    }

  }
}

