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

  public loader: any;
  public video: any;
  public clickvideo: any;
  public interval: any;
  public i: any;
  public list = [];
  public b: any;
  public timevalue: any;
  public intervaltime: any;
  public intervaltime2: any;
  public morevideo: any;
  public durationcurrent: any;
  public durationfinish: any;
  public title: any;
  public loadervideo: any;
  public load: any;
  public name: any;
  public episode: any;

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
          var self = this
          this.video = document.getElementById("videoplayer");
          this.video.load()
          this.load = false;
          this.i = 0;
          this.b = this.list.length - (this.list.length - 1)
          this.morevideo = false;
          this.doInterval1();
          this.doInterval2();

          this.video.addEventListener('ended', function () {
            if (self.i < (self.list.length - 1)) {
              self.i = self.i + 1
              self.url = self.list[self.i].url
              self.video.load()
              self.video.play()
            }
            else {
              self.url = self.list[0].url
              self.i = 0
              self.video.load()
              self.video.pause()
            }
          });
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
            this.clickvideo = false;
            this.api.get("table/z_channel_stream_detail", { params: { limit: 1000, filter: "name='" + this.name + "'", sort: "episode" + " ASC " } })
              .subscribe(val => {
                this.list = val['data'];
                this.url = this.url
                this.title = this.name + " Episode " + this.episode
              });
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
  doInterval1() {
    this.intervaltime = setInterval(() => {
      this.timevalue = this.video.currentTime
      var secduration: any;
      secduration = this.video.duration
      var hoursduration: any;
      var minduration: any;
      hoursduration = Math.floor(secduration / 3600);
      (hoursduration >= 1) ? secduration = secduration - (hoursduration * 3600) : hoursduration = '00';
      minduration = Math.floor(secduration / 60);
      (minduration >= 1) ? secduration = secduration - (minduration * 60) : minduration = '00';
      (secduration < 1) ? secduration = '00' : void 0;

      (minduration.toString().length == 1) ? minduration = '0' + minduration : void 0;
      (secduration.toString().length == 1) ? secduration = '0' + secduration : void 0;
      if (hoursduration != 0) {
        var sec: any;
        if (secduration < 10 && secduration > 0) {
          sec = '0' + secduration.toFixed(0)
        }
        else if (secduration >= 10 && secduration > 0) {
          sec = secduration.toFixed(0)
        }
        if (secduration > 0) {
          this.durationfinish = hoursduration + ':' + minduration + ':' + sec
        }
        else {
          this.durationfinish = hoursduration + ':' + minduration + ':' + secduration
        }
      }
      else {
        if (secduration < 10 && secduration > 0) {
          sec = '0' + secduration.toFixed(0)
        }
        else if (secduration >= 10 && secduration > 0) {
          sec = secduration.toFixed(0)
        }
        if (secduration > 0) {
          this.durationfinish = minduration + ':' + sec
        }
        else {
          this.durationfinish = minduration + ':' + secduration
        }
      }
      return hoursduration + ':' + minduration + ':' + secduration;
    }, 100);
  }
  doInterval2() {
    this.intervaltime2 = setInterval(() => {
      var seccurrent: any;
      seccurrent = this.video.currentTime
      var hourscurrent: any;
      var mincurrent: any;
      hourscurrent = Math.floor(seccurrent / 3600);
      (hourscurrent >= 1) ? seccurrent = seccurrent - (hourscurrent * 3600) : hourscurrent = '00';
      mincurrent = Math.floor(seccurrent / 60);
      (mincurrent >= 1) ? seccurrent = seccurrent - (mincurrent * 60) : mincurrent = '00';
      (seccurrent < 1) ? seccurrent = '00' : void 0;

      (mincurrent.toString().length == 1) ? mincurrent = '0' + mincurrent : void 0;
      (seccurrent.toString().length == 1) ? seccurrent = '0' + seccurrent : void 0;
      if (hourscurrent != 0) {
        var sec2: any;
        if (seccurrent < 10 && seccurrent > 0) {
          console.clear()
          sec2 = '0' + seccurrent.toFixed(0)
        }
        else if (seccurrent >= 10 && seccurrent > 0) {
          console.clear()
          sec2 = seccurrent.toFixed(0)
        }
        if (seccurrent > 0) {
          this.durationcurrent = hourscurrent + ':' + mincurrent + ':' + sec2
        }
        else {
          this.durationcurrent = hourscurrent + ':' + mincurrent + ':' + seccurrent
        }
      }
      else {
        if (seccurrent < 10 && seccurrent > 0) {
          console.clear()
          sec2 = '0' + seccurrent.toFixed(0)
        }
        else if (seccurrent >= 10 && seccurrent > 0) {
          console.clear()
          sec2 = seccurrent.toFixed(0)
        }
        if (seccurrent > 0) {
          this.durationcurrent = mincurrent + ':' + sec2
        }
        else {
          this.durationcurrent = mincurrent + ':' + seccurrent
        }
      }
      return hourscurrent + ':' + mincurrent + ':' + seccurrent;
    }, 100);
  }
  doClick() {
    this.clickvideo = true
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.clickvideo = false;
      clearInterval(this.interval)
    }, 5000);
  }
  doPrevious() {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.clickvideo = false;
      clearInterval(this.interval)
    }, 5000);
    this.i = this.i - 1
    this.url = this.list[this.i].url
    this.title = this.list[this.i].name + " Episode " + this.list[this.i].episode
    this.video.load()
    this.video.play()
  }
  doNext() {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.clickvideo = false;
      clearInterval(this.interval)
    }, 5000);
    this.i = this.i + 1
    this.url = this.list[this.i].url
    this.title = this.list[this.i].name + " Episode " + this.list[this.i].episode
    this.video.load()
    this.video.play()
  }
  doPlay() {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.clickvideo = false;
      clearInterval(this.interval)
    }, 5000);
    this.video.play()
  }
  doPause() {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.clickvideo = false;
      clearInterval(this.interval)
    }, 5000);
    this.video.pause()
  }
  doVolumeOn() {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.clickvideo = false;
      clearInterval(this.interval)
    }, 5000);
    this.video.muted = true;
  }
  doVolumeOff() {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.clickvideo = false;
      clearInterval(this.interval)
    }, 5000);
    this.video.muted = false;
  }
  doChangeTime() {
    var a = this.video.currentTime
    var b = this.timevalue
    if (a != b) {
      clearInterval(this.intervaltime)
      clearInterval(this.intervaltime2)
      this.video.currentTime = b
      this.doInterval1();
      this.doInterval2();
    }
  }
  doForward() {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.clickvideo = false;
      clearInterval(this.interval)
    }, 5000);
    this.video.currentTime = this.video.currentTime + 5
  }
  doRewind() {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.clickvideo = false;
      clearInterval(this.interval)
    }, 5000);
    this.video.currentTime = this.video.currentTime - 5
  }
  doMoreVideoOn() {
    clearInterval(this.interval)
    this.clickvideo = true;
    this.morevideo = true;
    /*var canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    var self = this;
    canvas.toBlob(function (blob) {
      saveAs(blob, self.title + ".png");
    });*/
  }
  doMoreVideoOff() {
    clearInterval(this.interval)
    this.clickvideo = false;
    this.morevideo = false;
  }
  doEpisode(video) {
    this.doMoreVideoOff()
    this.i = video.Row
    this.url = video.url
    this.title = video.name + " Episode " + video.episode
    this.i = video.Row - 1
    this.video.load()
    this.video.play()
  }
}
