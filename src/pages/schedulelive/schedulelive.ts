import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';

declare var window: any;

@IonicPage()
@Component({
  selector: 'page-schedulelive',
  templateUrl: 'schedulelive.html',
})
export class SchedulelivePage {

  public channels = [];
  public datecurrent: any;
  public datetimecurrent: any;
  public channel: any;
  public url = [];
  public loader: any;
  public loading: any;
  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public admob: AdMobPro,
    public navParam: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      
    });

    this.loading.present().then(() => {
      this.datecurrent = moment().format('YYYY-MM-DD');
      this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
      this.api.get("table/z_schedule_tv", { params: { limit: 1000, filter: "date_start <=" + "'" + this.datetimecurrent + "'" + " AND " + "date_finish >" + "'" + this.datetimecurrent + "'", sort: "channel" + " ASC " } })
        .subscribe(val => {
          this.channels = val['data']
          let data = val['data'];
          for (let i = 0; i < data.length; i++) {

          };
          this.loading.dismiss()
        });
    });
  }
  goToPlay(channel) {
    this.api.get("table/z_channel", { params: { limit: 1000, filter: "id=" + "'" + channel.id_channel + "'" } })
      .subscribe(val => {
        this.url = val['data']
        if (this.url[0].plugin == '1') {
          var videoUrl = this.url[0].url;
          var options = {
            successCallback: function () {

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
            controls: channel.controls // true(default)/false. Used to hide controls on fullscreen
          };
          window.plugins.streamingMedia.playVideo(videoUrl, options);
          var admobid = {
            banner: 'ca-app-pub-7488223921090533/8319723789',
            interstitial: 'ca-app-pub-7488223921090533/6830564057'
          };
      
          this.admob.prepareInterstitial({
            adId: admobid.interstitial,
            isTesting: true,
            autoShow: true
          })
        }
        else {
          this.navCtrl.push('LivePage', {
            url: this.url[0].url,
            stream: this.url[0].stream,
            xml: this.url[0].xml,
            rotate: this.url[0].orientation,
            subsbody1: this.url[0].subsbody_1,
            subsbody2: this.url[0].subsbody_2,
            subshead1: this.url[0].subshead_1,
            subshead2: this.url[0].subshead_2
          })
        }
      });
  }
  ionViewDidEnter() {
    var admobid = {
      banner: 'ca-app-pub-7488223921090533/8319723789',
      interstitial: 'ca-app-pub-7488223921090533/6830564057'
    };

    this.admob.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: true,
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
