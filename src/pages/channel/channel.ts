import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { AdMobPro } from '@ionic-native/admob-pro';

@IonicPage()
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {

  public streaming = [];
  public loader: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    private admobnews: AdMobPro) {
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present();
    this.doGetLive();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doGetLive() {
    this.api.get('table/z_streaming', { params: { filter: "status='OPEN'" } })
      .subscribe(val => {
        this.streaming = val['data']
      });
  }
  ionViewDidEnter() {
    var admobid = {
      banner: 'ca-app-pub-7488223921090533/9446361096',
      interstitial: 'ca-app-pub-7488223921090533/9226869245'
    };

    this.admobnews.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: true,
      autoShow: true,
      overlap: true,
      position: this.admobnews.AD_POSITION.BOTTOM_CENTER,
    });
  }
  ionViewWillLeave() {
    this.admobnews.removeBanner();
  }

}
