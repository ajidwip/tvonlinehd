import { Component } from '@angular/core';
import { LoadingController, NavController, Platform, AlertController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';

// declare var Swiper: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public channellist = [];
  public loader: any;

  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private admob: AdMobPro) {
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading...'
    });
    this.loader.present().then(() => {
      /*var swiper = new Swiper('.swiper-container', {
        slidesPerView: 2,
        spaceBetween: 3,
        freeMode: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });*/
    });
    this.doGetListChannel();
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
      isTesting: false,
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
  doGetListChannel() {
    this.api.get("table/z_list_channel", { params: { filter: "status='OPEN'",limit: 100, sort: "name" + " ASC " } })
      .subscribe(val => {
        this.channellist = val['data']
      });
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doDetail(channel) {
    this.navCtrl.push('ChannelPage', {
      name: channel.name,
      category: channel.category
    })
  }
}
