import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';

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
    this.api.get("table/z_channel", { params: { limit: 1000, filter: "id=" + "'" + channel.id_channel + "'" } })
      .subscribe(val => {
        this.url = val['data']
        if (this.url[0].plugin == '1') {
          var videoUrl = this.url[0].url;
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
  goToPlayAnime(channel) {
    this.navCtrl.push('PlayerPage', {
      url: channel.url,
      type: channel.type,
      stream: channel.stream
    })
  }

}
