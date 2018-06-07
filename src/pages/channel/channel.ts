import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {
  public channels = [];
  public channeldetail = [];
  public channelcategory: any;
  public channelname: any;
  public loader: any;
  public url: any;
  public id: any;
  public radiostream: boolean;
  public datecurrent: any;
  public datetimecurrent: any;
  public searchfilm: any;
  halaman = 0;
  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navParam: NavParams,
    public loadingCtrl: LoadingController,
    private admob: AdMobPro) {
    this.datecurrent = moment().format('YYYY-MM-DD');
    this.datetimecurrent = moment().format('YYYY-MM-DD h:mm');
    this.radiostream = false;
    this.loader = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loader.present()
    this.channelcategory = this.navParam.get('category')
    this.channelname = this.navParam.get('name')
    if (this.channelcategory == 'TV') {
      this.doGetChannel();
    }
    else if (this.channelcategory == 'STREAM') {
      this.doGetChannelStream();
    }
    else if (this.channelcategory == 'LIVE') {
      this.doGetChannelLive();
      this.api.get("table/z_channel_live", { params: { limit: 30, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
        .subscribe(val => {
          this.channeldetail = val['data'];
        });
    }
    else if (this.channelcategory == 'RADIO') {
      this.doGetChannelRadio();
    }
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
            this.searchfilm = val['data']
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
  doGetChannelLive() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_live", { params: { limit: 30, offset: offset, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND date >=" + "'" + this.datecurrent + "'", group: "date", sort: "date" + " ASC " } })
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
  doGetChannelLiveDetail() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_live", { params: { limit: 30, offset: offset, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
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
  }
  ionViewWillLeave() {
    this.admob.removeBanner();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
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
  }
  doPlay(channel) {
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
      this.navCtrl.push('LivePage', {
        url: channel.url
      })
    }
  }
  doPlayLive(channeld) {
    this.navCtrl.push('LivePage', {
      url: channeld.url
    })
  }
  getSearch(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.channels = this.searchfilm.filter(channel => {
        return channel.title.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.channels = this.searchfilm;
    }
  }

}
