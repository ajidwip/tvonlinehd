import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';
import { ApiProvider } from '../../providers/api/api';

declare var Clappr: any;
declare var LevelSelector: any;
declare var videojs: any;
declare var jwplayer: any;

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {
  public url: any;
  public type: any;
  public xml: any;
  public thumbnail: any;
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
        this.xml = this.navParams.get('xml');
        this.thumbnail = this.navParams.get('thumbnail');
        this.loading.present().then(() => {
          if (this.stream == '0') {
            if (this.xml == '2') {
              let playerElement = document.getElementById("player-wrapper");
              var player = new Clappr.Player({
                source: this.url,
                mute: true,
                height: this.height,
                width: this.width,
                autoPlay: true,
                plugins: [LevelSelector]
              });

              player.attachTo(playerElement);
            }
            else if (this.xml == '3') {
              let playerElement = document.getElementById("streaming");
              jwplayer(playerElement).setup({
                sources: [{
                  file: this.url,
                  image: this.thumbnail
                }],
                rtmp: {
                  bufferlength: 3
                },
                qualityLabels: {
                  "1024": "HD", "512": "High", "256": "Medium", "128": "Low"
                },
                image: this.thumbnail,
                fallback: true,
                width: "100%",
                autostart: "true",
                androidhls: true,
                startparam: "start",
                aspectratio: "16:9",
                stretching: "exactfit",
                nextupoffset: -10,
                playbackRateControls: true,
                controls: true
              });

            }
            else {
              let playerElement = document.getElementById("video-player");
              var video = videojs(playerElement);
              video.qualityPickerPlugin();
            }
          }
          else if (this.stream == '1') {
            const browser = this.iab.create(this.url, '_blank', 'location=no');
          }
          else {
            this.stream = this.navParams.get('stream');
            this.url = this.navParams.get('url');
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

    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_admob", { params: { limit: 100, filter: "appid=" + "'" + this.packagename + "' AND status='OPEN'" } })
        .subscribe(val => {
          this.ads = val['data']
          var admobid = {
            banner: this.ads[0].ads_banner,
            interstitial: this.ads[0].ads_interstitial
          };

          this.admob.prepareInterstitial({
            adId: admobid.interstitial,
            isTesting: this.ads[0].testing,
            autoShow: true
          })
        });
    }, (err) => {

    })
  }
  ionViewWillLeave() {
    //this.admob.removeBanner();
  }
}
