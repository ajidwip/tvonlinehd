import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher, Platform, LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { AppVersion } from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-channeldetail',
  templateUrl: 'channeldetail.html',
})
export class ChanneldetailPage {
  public anime: any;
  public channeldetail = [];
  halaman = 0;
  public loader: any;
  public packagename: any;
  public ads: any;

  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public platform: Platform,
    public navParams: NavParams,
    public admob: AdMobPro,
    public loadingCtrl: LoadingController,
    private androidFullScreen: AndroidFullScreen,
    public appVersion: AppVersion,
    public api: ApiProvider) {
    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_admob", { params: { limit: 100, filter: "appid=" + "'" + this.packagename + "' AND status='OPEN'" } })
        .subscribe(val => {
          this.ads = val['data']
        });
    }, (err) => {

    })
    this.anime = this.navParams.get('anime')
    this.loader = this.loadingCtrl.create({

    });
    this.loader.present().then(() => {
      this.doGetChannelDetail();
    });
  }
  doGetChannelDetail() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/z_channel_stream_detail', { params: { limit: 30, offset: offset, filter: "name=" + "'" + this.anime + "'", sort: "episode" + " DESC " } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.channeldetail.push(data[i]);
            }
            this.loader.dismiss();
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })

  }
  doInfinite(infiniteScroll) {
    this.doGetChannelDetail().then(response => {
      infiniteScroll.complete();

    })
  }
  doRefresh(refresher) {
    this.doGetChannelDetail().then(response => {
      refresher.complete();
    })
  }
  goToPlayAnime(channel) {
    this.navCtrl.push('PlayerPage', {
      url: channel.url,
      type: channel.type,
      stream: channel.stream,
      xml: channel.xml,
      thumbnail: channel.thumbnail_picture
    })
  }
  ionViewDidLoad() {
  }
  ionViewDidEnter() {
    this.androidFullScreen.isImmersiveModeSupported()
      .then(() => this.androidFullScreen.showSystemUI())
      .catch(err => console.log(err));
    var admobid = {
      banner: this.ads[0].ads_banner,
      interstitial: this.ads[0].ads_interstitial
    };

    this.admob.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: this.ads[0].testing,
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

}
