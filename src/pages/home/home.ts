import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public tv = '';
  public channelindo = [];
  public channelsports = [];

  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public platform: Platform,
    private admob: AdMobPro) {
    this.tv = 'indonesia'
    this.doGetChannelIndonesia();
    this.doGetChannelSports();
  }
  ionViewDidLoad() {
  }
  ionViewDidEnter() {
    var admobid = {
      banner: 'ca-app-pub-7488223921090533/3868398990',
      interstitial: 'ca-app-pub-7488223921090533/2330836488'
    };

    this.admob.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: true,
      autoShow: true,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
    });
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }
  ionViewWillLeave() {
    this.admob.removeBanner();
  }
  goToLiveIndo(indo) {
    this.navCtrl.push('LivePage', {
      url: indo.url
    })
  }
  goToLiveSports(sports) {
    this.navCtrl.push('LivePage', {
      url: sports.url
    })
  }
  doGetChannelIndonesia() {
    this.api.get("table/z_channel", { params: { limit: 100, filter: "country=" + "'Indonesia' AND status='OPEN'", sort: "channel_name" + " ASC " } })
      .subscribe(val => {
        this.channelindo = val['data']
      });
  }
  doGetChannelSports() {
    this.api.get("table/z_channel", { params: { limit: 100, filter: "category=" + "'Sports' AND status='OPEN'", sort: "channel_name" + " ASC " } })
      .subscribe(val => {
        this.channelsports = val['data']
      });
  }
}
