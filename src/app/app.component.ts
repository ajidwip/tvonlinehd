import { ViewChild, Component } from '@angular/core';
import { AlertController, LoadingController, NavController, Events, MenuController, Platform, Nav, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../providers/api/api';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('mycontent') Nav: NavController;
  rootPage: any = HomePage;
  public pages = [];
  public subs = [];
  showLevel1 = null;
  showLevel2 = null;
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
      this.api.get("table/z_list_channel", { params: { limit: 100, sort: "name" + " ASC " } })
        .subscribe(val => {
          this.pages = val['data']
        });
    });
  }
  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };
  toggleLevel1(idx) {
    this.subs = [];
    if (idx == 'idx0') {
      this.api.get("table/z_list_anime", { params: { limit: 200, sort: "name" + " ASC " } })
        .subscribe(val => {
          this.subs = val['data']
        });
    }
    else if (idx == 'idx1') {
      this.api.get("table/z_channel_live", { params: { limit: 100, filter: "status='TEST'", sort: "datestart" + " ASC " } })
        .subscribe(val => {
          this.subs = val['data']
        });
    }
    else if (idx == 'idx2') {
      this.api.get("table/z_channel", { params: { limit: 100, filter: "country=" + "'Indonesia' AND status='OPEN'", sort: "channel_name" + " ASC " } })
        .subscribe(val => {
          this.subs = val['data']
        });
    }
    else if (idx == 'idx3') {
      this.api.get("table/z_channel", { params: { limit: 100, filter: "category=" + "'Sports' AND status='OPEN'", sort: "channel_name" + " ASC " } })
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

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  };
}

