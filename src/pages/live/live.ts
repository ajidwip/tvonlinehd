import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
// import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AdMobPro } from '@ionic-native/admob-pro';

@IonicPage()
@Component({
  selector: 'page-live',
  templateUrl: 'live.html',
})
export class LivePage {
  public url = '';
  public loading: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private screenOrientation: ScreenOrientation,
    public loadingCtrl: LoadingController,
    private admob: AdMobPro,
    public platform: Platform) {
    this.loading = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading...'
    });
    this.loading.present();
    this.url = this.navParams.get('url')
  }
  ngAfterViewInit() {
    this.loading.dismiss();
  }
  /*ionViewDidEnter() {
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    }
  }*/
  ionViewDidLoad() {
  }
  ionViewDidEnter() {
    var admobid = {
      banner: 'ca-app-pub-7488223921090533/3868398990',
      interstitial: 'ca-app-pub-7488223921090533/2330836488'
    };

    this.admob.prepareInterstitial({
      adId: admobid.interstitial,
      isTesting: true,
      autoShow: true
    })
  }
  ionViewWillLeave() {
    this.admob.removeBanner();
  }

}
