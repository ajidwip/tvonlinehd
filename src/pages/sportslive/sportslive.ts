import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';

declare var window: any;

@IonicPage()
@Component({
  selector: 'page-sportslive',
  templateUrl: 'sportslive.html',
})
export class SportslivePage {

  public channels = [];
  public datecurrent: any;
  public datetimecurrent: any;
  public channel: any;
  public url = [];
  public param: any;
  public loader: any;
  public name: any;
  public loading: any;
  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navParam: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present().then(() => {
      this.datecurrent = moment().format('YYYY-MM-DD');
      this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
      this.param = this.navParam.get('param')
      if (this.param == '0') {
        this.name = 'Live Today'
        this.api.get("table/z_channel_live", { params: { limit: 1000, filter: "date=" + "'" + this.datecurrent + "'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            this.channels = val['data']
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {

            };
            this.loading.dismiss()
          });
      }
      else {
        this.name = 'Live Now'
        this.api.get("table/z_channel_live", { params: { limit: 1000, filter: "datestart <=" + "'" + this.datetimecurrent + "'" + " AND " + "datestart >" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            this.channels = val['data']
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              for (let i = 0; i < data.length; i++) {

              };
            };
            this.loading.dismiss()
          });
      }
    });
  }
  goToPlay(channel) {
    if (channel.url && channel.plugin != '1') {
      this.navCtrl.push('LivePage', {
        url: channel.url,
        stream: channel.stream
      })
    }
    else if (channel.url && channel.plugin == '1') {
      var videoUrl = channel.url;
      var options = {
        successCallback: function () {
          console.log("Video was closed without error.");
        },
        errorCallback: function (errMsg) {
          let toast = this.toastCtrl.create({
            message: errMsg,
            duration: 3000
          });
          toast.present();
        },
        orientation: 'landscape',
        shouldAutoClose: true,  // true(default)/false
        controls: false // true(default)/false. Used to hide controls on fullscreen
      };
      window.plugins.streamingMedia.playVideo(videoUrl, options);
    }
    else {
      let alert = this.alertCtrl.create({
        subTitle: 'Pertandingan belum dimulai',
        buttons: ['OK']
      });
      alert.present();
    }
  }
  ionViewDidEnter() {
    /*var admobid = {
      banner: 'ca-app-pub-7488223921090533/3868398990',
      interstitial: 'ca-app-pub-7488223921090533/2330836488'
    };

    this.admob.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: false,
      autoShow: true,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
    });*/
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

}
