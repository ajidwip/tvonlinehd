import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AdMobPro } from '@ionic-native/admob-pro';

declare var Clappr: any;
declare var LevelSelector: any;

@IonicPage()
@Component({
  selector: 'page-live',
  templateUrl: 'live.html',
})
export class LivePage {
  public url = '';
  public stream: any;
  public xml: any;
  public rotate: any;
  public loading: any;
  public width: any;
  public height: any;
  public subsbody1: any;
  public subsbody2: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private screenOrientation: ScreenOrientation,
    public loadingCtrl: LoadingController,
    private admob: AdMobPro,
    public platform: Platform) {
    this.loading = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading...'
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
          this.subsbody1 = this.navParams.get('subsbody1');
          this.subsbody2 = this.navParams.get('subsbody2');
          this.loading.present().then(() => {
            if (this.stream == '0') {
              if (this.xml == '1') {
                var self = this
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                  if (xhr.readyState == XMLHttpRequest.DONE) {
                    var body = xhr.responseText.substring(self.subsbody1, self.subsbody2)
                    xhr.onload = () => {
                      var playerElement = document.getElementById("player-wrapper");
                      var player = new Clappr.Player({
                        source: body,
                        mute: true,
                        height: self.height,
                        width: self.width + 40,
                        autoPlay: true,
                        plugins: [LevelSelector]
                      });
                      player.attachTo(playerElement);
                    }
                  }
                }
                xhr.open('GET', self.url, true);
                xhr.send(null);
              }
              else {
                var playerElement = document.getElementById("player-wrapper");
                var player = new Clappr.Player({
                  source: this.url,
                  mute: true,
                  height: this.height,
                  width: this.width + 40,
                  autoPlay: true,
                  plugins: [LevelSelector]
                });
                player.attachTo(playerElement);
              }
            }
          });
        })
      }
    }
    else {
      this.stream = this.navParams.get('stream');
      this.url = this.navParams.get('url');
    }
  }
  ngAfterViewInit() {
    this.loading.dismiss();
  }
  ionViewDidLoad() {
  }
  ionViewDidEnter() {
    /*var admobid = {
      banner: 'ca-app-pub-7488223921090533/3868398990',
      interstitial: 'ca-app-pub-7488223921090533/2330836488'
    };

    this.admob.prepareInterstitial({
      adId: admobid.interstitial,
      isTesting: false,
      autoShow: true
    })*/
  }
  ionViewWillLeave() {
    //this.admob.removeBanner();
  }

}
