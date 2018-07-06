import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AdMobPro } from '@ionic-native/admob-pro';

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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    public loadingCtrl: LoadingController,
    private admob: AdMobPro,
    public platform: Platform) {
    this.loading = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading...'
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
