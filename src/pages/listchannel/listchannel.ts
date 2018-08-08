import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';
import { AppVersion } from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-listchannel',
  templateUrl: 'listchannel.html',
})
export class ListchannelPage {

  public channels = [];
  public datecurrent: any;
  public datetimecurrent: any;
  public loader: any;
  public loading: any;
  public packagename: any;
  public ads: any;

  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navParam: NavParams,
    public admob: AdMobPro,
    public toastCtrl: ToastController,
    public appVersion: AppVersion,
    public loadingCtrl: LoadingController) {
    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_admob", { params: { limit: 100, filter: "appid=" + "'" + this.packagename + "' AND status='OPEN'" } })
        .subscribe(val => {
          this.ads = val['data']
        });
    }, (err) => {

    })
    this.loading = this.loadingCtrl.create({

    });

    this.loading.present().then(() => {
      this.datecurrent = moment().format('YYYY-MM-DD');
      this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
      this.api.get("table/z_schedule_tv", { params: { limit: 1000, filter: "date=" + "'" + this.datecurrent + "'", group: 'channel', sort: "channel" + " ASC " } })
        .subscribe(val => {
          this.channels = val['data']
          let data = val['data'];
          for (let i = 0; i < data.length; i++) {

          };
          this.loading.dismiss()
        });
    });
  }
  doGotoSchedule(channel) {
    this.navCtrl.push('SchedulePage', {
      channel: channel.channel
    })
  }
  ionViewDidEnter() {
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
