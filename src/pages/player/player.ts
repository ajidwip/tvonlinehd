import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';
import { ApiProvider } from '../../providers/api/api';

declare var videojs: any;

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {
  public url: any;
  public type: any;
  public stream: any;
  public loading: any;
  public width: any;
  public height: any;
  public packagename: any;
  public ads: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    public loadingCtrl: LoadingController,
    private admob: AdMobPro,
    private androidFullScreen: AndroidFullScreen,
    private iab: InAppBrowser,
    public api: ApiProvider,
    public appVersion: AppVersion,
    public platform: Platform) {
    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_admob", { params: { limit: 100, filter: "appid=" + "'" + this.packagename + "' AND status='OPEN'" } })
        .subscribe(val => {
          this.ads = val['data']
        });
    });
    this.loading = this.loadingCtrl.create({
      // cssClass: 'transparent',

    });
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).then(() => {
        this.width = platform.height();
        this.height = platform.width();
        this.stream = this.navParams.get('stream');
        this.type = this.navParams.get('type');
        this.url = this.navParams.get('url');
        this.loading.present().then(() => {
          if (this.stream == '0') {
            let playerElement = document.getElementById("video-player");
            var video = videojs(playerElement);
            video.qualityPickerPlugin();
          }
          else if (this.stream == '1') {
            const browser = this.iab.create(this.url, '_blank', 'location=no');
          }
        });
      })
    }
  }
  ngAfterViewInit() {
    this.loading.dismiss();
  }
  ionViewDidLoad() {
  }
  ionViewDidEnter() {
    this.androidFullScreen.isImmersiveModeSupported()
      .then(() => this.androidFullScreen.immersiveMode())
      .catch(err => console.log(err));
    var admobid = {
      banner: this.ads[0].ads_banner,
      interstitial: this.ads[0].ads_interstitial
    };

    this.admob.prepareInterstitial({
      adId: admobid.interstitial,
      isTesting: this.ads[0].testing,
      autoShow: true
    })
  }
  ionViewWillLeave() {
    //this.admob.removeBanner();
  }
}
