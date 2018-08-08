import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
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
  selector: 'page-live',
  templateUrl: 'live.html',
})
export class LivePage {
  public url = '';
  public stream: any;
  public xml: any;
  public thumbnail: any;
  public rotate: any;
  public loading: any;
  public width: any;
  public height: any;
  public subsbody1: any;
  public subsbody2: any;
  public subshead1: any;
  public subshead2: any;
  public packagename: any;
  public ads: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private screenOrientation: ScreenOrientation,
    public loadingCtrl: LoadingController,
    private admob: AdMobPro,
    private androidFullScreen: AndroidFullScreen,
    public api: ApiProvider,
    public appVersion: AppVersion,
    private iab: InAppBrowser,
    public platform: Platform) {
    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_admob", { params: { limit: 100, filter: "appid=" + "'" + this.packagename + "' AND status='OPEN'" } })
        .subscribe(val => {
          this.ads = val['data']
        });
    }, (err) => {

    })
    /*this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop()
    });*/
    this.loading = this.loadingCtrl.create({
      // cssClass: 'transparent',

    });
    this.rotate = this.navParams.get('rotate');
    if (this.rotate != '0') {
      if (this.platform.is('cordova')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).then(() => {
          this.width = platform.height();
          this.height = platform.width();
          this.stream = this.navParams.get('stream');
          this.url = this.navParams.get('url');
          this.xml = this.navParams.get('xml');
          this.thumbnail = this.navParams.get('thumbnail');
          this.subsbody1 = this.navParams.get('subsbody1');
          this.subsbody2 = this.navParams.get('subsbody2');
          this.subshead1 = this.navParams.get('subshead1');
          this.subshead2 = this.navParams.get('subshead2');
          this.loading.present().then(() => {
            if (this.stream == '0') {
              if (this.xml == '1') {
                var self = this
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                  if (xhr.readyState == XMLHttpRequest.DONE) {
                    var body = xhr.responseText.substring(self.subsbody1, self.subsbody2)
                    self.url = body
                    let playerElement = document.getElementById("player-wrapper");
                    var player = new Clappr.Player({
                      source: body,
                      mute: true,
                      height: self.height,
                      width: self.width,
                      autoPlay: true,
                      plugins: [LevelSelector]
                    });

                    player.attachTo(playerElement);
                  }
                }
                xhr.open('GET', self.url, true);
                xhr.send(null);
              }
              else if (this.xml == '2') {
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
              else if (this.xml == '4') {
                let alert = this.alertCtrl.create({
                  subTitle: 'working',
                  buttons: ['OK']
                });
                alert.present();
                var selfurl = this
                var url = selfurl.url + "?width=" + selfurl.width + "&" + "height=" + selfurl.height
                var xhrurl = new XMLHttpRequest();
                xhrurl.onreadystatechange = function () {
                  if (xhrurl.readyState == XMLHttpRequest.DONE) {
                    var body = xhrurl.responseText.substring(selfurl.subsbody1, selfurl.subsbody2)
                    var head = xhrurl.responseText.substring(selfurl.subshead1, selfurl.subshead2)
                    selfurl.url = body
                    let alert = selfurl.alertCtrl.create({
                      subTitle: head,
                      message: body,
                      buttons: ['OK']
                    });
                    alert.present();
                    document.write(head)
                  }
                }
                xhrurl.open('GET', url, true);
                xhrurl.send(null);
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
          });
        })
      }
    }
    else {
      this.stream = this.navParams.get('stream');
      this.url = this.navParams.get('url');
      this.xml = this.navParams.get('xml');
      if (this.stream == '1') {
        const browser = this.iab.create(this.url, '_blank', 'location=no');
      }
      else {
        this.stream = this.navParams.get('stream');
        this.url = this.navParams.get('url');
      }
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
