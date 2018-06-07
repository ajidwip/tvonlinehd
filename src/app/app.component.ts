import { ViewChild, Component } from '@angular/core';
import { AlertController, LoadingController, NavController, Events, MenuController, Platform, Nav, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../providers/api/api';
import { HomePage } from '../pages/home/home';
import moment from 'moment';

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
  public datecurrent:any;
  public datetimecurrent:any;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public events: Events,
    public app: App,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.datecurrent = moment().format('YYYY-MM-DD');
      this.datetimecurrent = moment().format('YYYY-MM-DD h:mm');
      this.api.get("table/z_list_channel", { params: { filter: "status='OPEN'", limit: 100, sort: "name" + " ASC " } })
        .subscribe(val => {
          this.pages = val['data']
        });
      this.api.get("table/z_status_app", { params: { filter: "status='TRUE'", limit: 100 } })
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
    });
  }
  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };
  toggleLevel1(idx, p) {
    this.subs = [];
    this.category = p.category;
    if (p.category == 'TV') {
      this.api.get("table/z_channel", { params: { limit: 100, filter: "name=" + "'" + p.name + "' AND status='OPEN'", sort: "title" + " ASC " } })
        .subscribe(val => {
          this.subs = val['data']
        });
    }
    else if (p.category == 'STREAM') {
      this.api.get("table/z_channel_stream", { params: { limit: 500, filter: "name=" + "'" + p.name + "' AND status='OPEN'", sort: "title" + " ASC " } })
        .subscribe(val => {
          this.subs = val['data']
        });
    }
    else if (p.category == 'LIVE') {
      this.api.get("table/z_channel_live", { params: { limit: 100, filter: "category=" + "'" + p.name + "' AND status='OPEN'" + " AND date >=" + "'" + this.datecurrent + "'", group: "date", sort: "date" + " ASC " } })
        .subscribe(val => {
          this.subs = val['data'];
        });
      this.api.get("table/z_channel_live", { params: { limit: 100, filter: "category=" + "'" + p.name + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "date" + " ASC " } })
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
}

