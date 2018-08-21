import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';
import { AppVersion } from '@ionic-native/app-version';
import { HttpHeaders } from "@angular/common/http";

declare var window: any;

@IonicPage()
@Component({
  selector: 'page-newupdateinfo',
  templateUrl: 'newupdateinfo.html',
})
export class NewupdateinfoPage {

  public channels = [];
  public datecurrent: any;
  public datetimecurrent: any;
  public channel: any;
  public url = [];
  public param: any;
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
    public toastCtrl: ToastController,
    public appVersion: AppVersion,
    public admob: AdMobPro,
    public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({

    });

    this.loading.present().then(() => {
      this.datecurrent = moment().format('YYYY-MM-DD');
      this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
      this.param = this.navParam.get('param')
      if (this.param == '0') {
        this.api.get("table/z_channel", { params: { limit: 10, filter: "status='OPEN'", sort: "date" + " DESC " } })
          .subscribe(val => {
            this.channels = val['data']
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {

            };
            this.loading.dismiss()
          });
      }
      else if (this.param == '1') {
        this.api.get("table/z_channel_stream", { params: { limit: 10, filter: "status='OPEN' AND name!='Anime'", sort: "date" + " DESC " } })
          .subscribe(val => {
            this.channels = val['data']
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {

            };
            this.loading.dismiss()
          });
      }
      else {
        this.api.get("table/z_channel_stream_detail", { params: { limit: 10, filter: "status='OPEN'", sort: "date" + " DESC " } })
          .subscribe(val => {
            this.channels = val['data']
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {

            };
            this.loading.dismiss()
          });
      }
    });
  }
  goToPlay(channel) {
    if (channel.type == 'STREAM') {
      this.api.get("table/z_channel_stream", { params: { limit: 1, filter: "id=" + "'" + channel.id + "'" } })
        .subscribe(val => {
          let data = val['data']
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_channel_stream",
            {
              "id": channel.id,
              "click": data[0].click + 1
            },
            { headers })
            .subscribe(val => {
            });
        });
    }
    else if (channel.type == 'TV') {
      this.api.get("table/z_channel", { params: { limit: 1, filter: "id=" + "'" + channel.id + "'" } })
        .subscribe(val => {
          let data = val['data']
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_channel",
            {
              "id": channel.id,
              "click": data[0].click + 1
            },
            { headers })
            .subscribe(val => {
            });
        });
    }
    if (channel.type == 'TV') {
      this.api.get("table/z_channel", { params: { limit: 30, filter: "id=" + "'" + channel.id + "'" } })
        .subscribe(val => {
          var self = this;
          let data = val['data']
          if (channel.plugin == '1') {
            var videoUrl = data[0].url;
            var options = {
              successCallback: function () {

              },
              errorCallback: function (errMsg) {
                self.api.get('nextno/z_report_url/id').subscribe(val => {
                  let nextno = val['nextno'];
                  const headers = new HttpHeaders()
                    .set("Content-Type", "application/json");
                  self.api.post("table/z_report_url",
                    {
                      "id": nextno,
                      "id_channel": channel.id,
                      "name": channel.name,
                      "title": channel.title,
                      "url": channel.url,
                      "date": moment().format('YYYY-MM-DD HH:mm:ss'),
                    },
                    { headers })
                    .subscribe(val => {
                      let toast = self.toastCtrl.create({
                        message: 'Report has been sent',
                        duration: 3000
                      });
                      toast.present();
                    });
                });
              },
              orientation: 'landscape',
              shouldAutoClose: true,  // true(default)/false
              controls: channel.controls // true(default)/false. Used to hide controls on fullscreen
            };
            window.plugins.streamingMedia.playVideo(videoUrl, options);
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
          else {
            this.navCtrl.push('LivePage', {
              url: data[0].url,
              stream: channel.stream,
              xml: channel.xml,
              rotate: channel.orientation,
              subsbody1: channel.subsbody_1,
              subsbody2: channel.subsbody_2,
              subshead1: channel.subshead_1,
              subshead2: channel.subshead_2
            })
          }
        });
    }
    else if (channel.type == 'STREAM') {
      this.navCtrl.push('PreviewPage', {
        id: channel.id,
        name: channel.name,
        title: channel.title,
        category: channel.category,
        trailer: channel.trailer,
        type: channel.type,
        stream: channel.stream,
        xml: channel.xml,
        plugin: channel.plugin,
        url: channel.url,
        controls: channel.controls
      })
    }
  }
  goToPlayAnime(channel) {
    this.navCtrl.push('PlayerPage', {
      url: channel.url,
      type: channel.type,
      stream: channel.stream,
      xml: channel.xml,
      thumbnail: channel.thumbnail_picture
    })
  }
  ionViewDidEnter() {
    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_admob", { params: { limit: 100, filter: "appid=" + "'" + this.packagename + "' AND status='OPEN'" } })
        .subscribe(val => {
          this.ads = val['data']
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
        });
    }, (err) => {

    })
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }
  ionViewWillLeave() {
    this.admob.removeBanner();
  }

}
