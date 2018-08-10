import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { AppVersion } from '@ionic-native/app-version';
import { HttpHeaders } from "@angular/common/http";

declare var window: any;
declare var videojs: any;

@IonicPage()
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {
  public channels = [];
  public channeldetail = [];
  public channelcategory: any;
  public channeltype: any;
  public channelname: any;
  public channelstream: any;
  public loader: any;
  public url: any;
  public id: any;
  public radiostream: boolean;
  public datecurrent: any;
  public datetimecurrent: any;
  public search: any;
  public title: any;
  public showsearch: boolean = false;
  halaman = 0;
  public packagename: any;
  public ads: any;
  public uuiddevices: any;

  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navParam: NavParams,
    public appVersion: AppVersion,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private androidFullScreen: AndroidFullScreen,
    private admob: AdMobPro) {
    this.loader = this.loadingCtrl.create({

    });
    this.loader.present().then(() => {
      this.datecurrent = moment().format('YYYY-MM-DD');
      this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
      this.radiostream = false;
      this.channelcategory = this.navParam.get('category')
      this.channeltype = this.navParam.get('type')
      this.channelname = this.navParam.get('name')
      this.uuiddevices = this.navParam.get('uuiddevices')
      if (this.channelcategory == 'TV') {
        this.doGetChannel();
        this.doGetChannelSearch();
      }
      else if (this.channelcategory == 'STREAM') {
        this.doGetChannelStream();
        this.doGetChannelStreamSearch();
      }
      else if (this.channelcategory == 'LIVE') {
        this.doGetChannelLive();
        this.doGetChannelLiveDetailSearch();
        this.api.get("table/z_channel_live", { params: { limit: 1000, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            this.channeldetail = val['data']
            this.loader.dismiss()
          });
      }
      else if (this.channelcategory == 'RADIO') {
        this.doGetChannelRadio();
        this.doGetChannelRadioSearch();
      }
      else if (this.channelcategory == 'ARSIP') {
        this.doGetChannelArsip();
        this.doGetChannelArsipSearch();
      }
      else if (this.channelcategory == 'MOSTWATCHED') {
        this.doGetChannelMostWatched();
        this.doGetChannelMostWatchedSearch();
      }
    });
  }
  doShowSearch() {
    this.showsearch = this.showsearch ? false : true
  }
  doHideSearch() {
    this.showsearch = this.showsearch ? false : true
  }
  doGetChannelSearch() {
    this.api.get("table/z_channel", { params: { limit: 10000, filter: "name=" + "'" + this.channelname + "' AND status='OPEN'", sort: "title" + " ASC " } })
      .subscribe(val => {
        this.search = val['data']
      });
  }
  doGetPlayer() {
    this.api.get("table/z_channel", { params: { limit: 10000, filter: "name=" + "'" + this.channelname + "' AND status='OPEN'", sort: "title" + " ASC " } })
      .subscribe(val => {
        this.search = val['data']
      });
  }
  doGetChannel() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel", { params: { limit: 30, offset: offset, filter: "name=" + "'" + this.channelname + "' AND status='OPEN'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            this.loader.dismiss();
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelStreamSearch() {
    this.api.get("table/z_channel_stream", { params: { limit: 10000, filter: "name=" + "'" + this.channelname + "' AND status='OPEN'", sort: "title" + " ASC " } })
      .subscribe(val => {
        this.search = val['data']
      });
  }
  doGetChannelStream() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_stream", { params: { limit: 30, offset: offset, filter: "name=" + "'" + this.channelname + "' AND status='OPEN'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            this.loader.dismiss();
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelArsipSearch() {
    this.api.get("table/z_arsip_users", { params: { limit: 10000, filter: "uuid_device=" + "'" + this.uuiddevices + "'", sort: "title" + " ASC " } })
      .subscribe(val => {
        this.search = val['data']
      });
  }
  doGetChannelArsip() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_arsip_users", { params: { limit: 30, offset: offset, filter: "uuid_device=" + "'" + this.uuiddevices + "'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            this.loader.dismiss();
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelMostWatchedSearch() {
    this.api.get("table/z_channel_stream", { params: { limit: 10000, filter: "status='OPEN'", sort: "click" + " DESC " } })
      .subscribe(val => {
        this.search = val['data']
      });
  }
  doGetChannelMostWatched() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_stream", { params: { limit: 30, offset: offset, filter: "status='OPEN'", sort: "click" + " DESC " } })
          .subscribe(val => {
            let data = val['data'];
            this.loader.dismiss();
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelLiveSearch() {
    this.api.get("table/z_channel_live", { params: { limit: 10000, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND date >=" + "'" + this.datecurrent + "'", group: "date", sort: "date" + " ASC " } })
      .subscribe(val => {
        this.search = val['data']
      });
  }
  doGetChannelLive() {
    return new Promise(resolve => {
      let offset = 100 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_live", { params: { limit: 100, offset: offset, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND date >=" + "'" + this.datecurrent + "'", group: "date", sort: "date" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelLiveDetailSearch() {
    this.api.get("table/z_channel_live", { params: { limit: 10000, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
      .subscribe(val => {
        this.search = val['data']
      });
  }
  doGetChannelLiveDetail() {
    return new Promise(resolve => {
      let offset = 100 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_live", { params: { limit: 100, offset: offset, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.channeldetail.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelRadioSearch() {
    this.api.get("table/z_channel_radio", { params: { limit: 10000, filter: "status='OPEN'", sort: "title" + " ASC " } })
      .subscribe(val => {
        this.search = val['data']
      });
  }
  doGetChannelRadio() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_radio", { params: { limit: 30, offset: offset, filter: "status='OPEN'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            this.loader.dismiss();
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  ionViewDidLoad() {
  }
  ionViewDidEnter() {
    this.androidFullScreen.isImmersiveModeSupported()
      .then(() => this.androidFullScreen.showSystemUI())
      .catch(err => console.log(err));
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
  doInfinite(infiniteScroll) {
    if (this.channelcategory == 'TV') {
      this.doGetChannel().then(response => {
        infiniteScroll.complete();
      });
    }
    else if (this.channelcategory == 'STREAM') {
      this.doGetChannelStream().then(response => {
        infiniteScroll.complete();
      });
    }
    else if (this.channelcategory == 'LIVE') {
      this.doGetChannelLive().then(response => {
        this.api.get("table/z_channel_live", { params: { limit: 30, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            this.channeldetail = val['data'];
          });
        infiniteScroll.complete();
      });
    }
    else if (this.channelcategory == 'RADIO') {
      this.doGetChannelRadio().then(response => {
        infiniteScroll.complete();
      });
    }
    else if (this.channelcategory == 'ARSIP') {
      this.doGetChannelArsip().then(response => {
        infiniteScroll.complete();
      });
    }
    else if (this.channelcategory == 'MOSTWATCHED') {
      this.doGetChannelMostWatched().then(response => {
        infiniteScroll.complete();
      });
    }
  }
  doRefresh(refresher) {
    if (this.channelcategory == 'TV') {
      this.doGetChannel().then(response => {
        refresher.complete();
      });
    }
    else if (this.channelcategory == 'STREAM') {
      this.doGetChannelStream().then(response => {
        refresher.complete();
      });
    }
    else if (this.channelcategory == 'LIVE') {
      this.doGetChannelLive().then(response => {
        this.doGetChannelLiveDetail();
        refresher.complete();
      });
    }
    else if (this.channelcategory == 'RADIO') {
      this.doGetChannelRadio().then(response => {
        refresher.complete();
      });
    }
    else if (this.channelcategory == 'ARSIP') {
      this.doGetChannelArsip().then(response => {
        refresher.complete();
      });
    }
    else if (this.channelcategory == 'MOSTWATCHED') {
      this.doGetChannelMostWatched().then(response => {
        refresher.complete();
      });
    }
  }
  doPlay(channel) {
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
    this.channelstream = channel.stream
    if (channel.type == 'STREAM') {
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
    else if (channel.type == 'RADIO') {
      this.radiostream = this.radiostream ? false : true;
      this.url = channel.url
      this.id = channel.id
    }
    else if (channel.plugin == '1') {
      this.api.get("table/z_channel", { params: { limit: 30, filter: "id=" + "'" + channel.id + "'" } })
        .subscribe(val => {
          let data = val['data']
          var videoUrl = data[0].url;
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
            banner: this.ads[0].ads_banner,
            interstitial: this.ads[0].ads_interstitial
          };

          this.admob.prepareInterstitial({
            adId: admobid.interstitial,
            isTesting: this.ads[0].testing,
            autoShow: true
          })
        });
    }
    else {
      if (channel.type == 'TV') {
        this.api.get("table/z_channel", { params: { limit: 30, filter: "id=" + "'" + channel.id + "'" } })
          .subscribe(val => {
            let data = val['data']
            this.navCtrl.push('LivePage', {
              url: data[0].url,
              stream: channel.stream,
              xml: channel.xml,
              rotate: channel.orientation,
              thumbnail: channel.thumbnail_picture,
              subsbody1: channel.subsbody_1,
              subsbody2: channel.subsbody_2,
              subshead1: channel.subshead_1,
              subshead2: channel.subshead_2
            })
          });
      }
      /*else if (channel.type == 'STREAM') {
        this.api.get("table/z_channel_stream", { params: { limit: 30, filter: "id=" + "'" + channel.id + "'" } })
          .subscribe(val => {
            let data = val['data']
            this.navCtrl.push('LivePage', {
              url: data[0].url,
              stream: channel.stream,
              xml: channel.xml,
              rotate: channel.orientation,
              thumbnail: channel.thumbnail_picture
            })
          });
      }*/
    }
  }
  /*doPlayPlayer(channel) {
    if (channel.type == 'STREAM' && channel.name == 'Anime') {
      this.navCtrl.push('ChanneldetailPage', {
        anime: channel.title
      })
    }
    else if (channel.type == 'RADIO') {
      this.radiostream = this.radiostream ? false : true;
      this.url = channel.url
      this.id = channel.id
    }
    else {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).then(() => {
        this.title = channel.id
        let playerElement = document.getElementById(this.title)
        var video = videojs(playerElement);
        video.qualityPickerPlugin();
        video.play();
        document.getElementById(this.title).style.display = 'block';
        this.channelstream = channel.stream
        if (this.channelstream == '1') {
          this.platform.registerBackButtonAction(() => {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).then(() => {
              let playerElement = document.getElementById(this.title);
              var video = videojs(playerElement);
              video.qualityPickerPlugin();
              video.pause();
              document.getElementById(this.title).style.display = 'none';
            });
          })
        }
      });
    }
  }*/
  doPlayLive(channeld) {
    this.api.get("table/z_channel_live", { params: { limit: 30, filter: "id=" + "'" + channeld.id + "'" } })
      .subscribe(val => {
        let data = val['data'];
        if (data[0].url && channeld.plugin != '1') {
          this.navCtrl.push('LivePage', {
            url: data[0].url,
            stream: channeld.stream,
            xml: channeld.xml,
            rotate: channeld.orientation,
            thumbnail: channeld.thumbnail_picture,
            subsbody1: channeld.subsbody_1,
            subsbody2: channeld.subsbody_2,
            subshead1: channeld.subshead_1,
            subshead2: channeld.subshead_2
          })
        }
        else if (data[0].url && channeld.plugin == '1') {
          var videoUrl = data[0].url;
          var options = {
            successCallback: function () {
              var admobid = {
                banner: this.ads[0].ads_banner,
                interstitial: this.ads[0].ads_interstitial
              };

              this.admob.prepareInterstitial({
                adId: admobid.interstitial,
                isTesting: this.ads[0].testing,
                autoShow: true
              })
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
            controls: channeld.controls // true(default)/false. Used to hide controls on fullscreen
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
      });
  }
  getSearch(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.channels = this.search.filter(channel => {
        return channel.title.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.channels = [];
      this.halaman = 0;
      if (this.channelcategory == 'TV') {
        this.doGetChannel();
      }
      else if (this.channelcategory == 'STREAM') {
        this.doGetChannelStream();
      }
      else if (this.channelcategory == 'LIVE') {
        this.doGetChannelLive();
        this.api.get("table/z_channel_live", { params: { limit: 1000, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            this.channeldetail = val['data']
          });
      }
      else if (this.channelcategory == 'RADIO') {
        this.doGetChannelRadio();
      }
      else if (this.channelcategory == 'ARSIP') {
        this.doGetChannelArsip();
      }
      else if (this.channelcategory == 'MOSTWATCHED') {
        this.doGetChannelMostWatched();
      }
    }
  }

}
