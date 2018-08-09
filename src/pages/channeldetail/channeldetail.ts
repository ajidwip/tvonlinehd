import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher, Platform, LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { AppVersion } from '@ionic-native/app-version';
import { HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-channeldetail',
  templateUrl: 'channeldetail.html',
})
export class ChanneldetailPage {
  public anime: any;
  public channeldetail = [];
  halaman = 0;
  public loader: any;
  public packagename: any;
  public ads: any;
  public showsearch: boolean = false;
  public search = [];

  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public platform: Platform,
    public navParams: NavParams,
    public admob: AdMobPro,
    public loadingCtrl: LoadingController,
    private androidFullScreen: AndroidFullScreen,
    public appVersion: AppVersion,
    public api: ApiProvider) {
    this.anime = this.navParams.get('anime')
    this.loader = this.loadingCtrl.create({

    });
    this.loader.present().then(() => {
      this.doGetChannelDetail();
      this.doGetSearch();
    });
  }
  doShowSearch() {
    console.log(this.showsearch)
    this.showsearch = this.showsearch ? false : true
  }
  doHideSearch() {
    console.log(this.showsearch)
    this.showsearch = this.showsearch ? false : true
  }
  doGetChannelDetail() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/z_channel_stream_detail', { params: { limit: 30, offset: offset, filter: "name=" + "'" + this.anime + "' AND status='OPEN'", sort: "episode" + " DESC " } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.channeldetail.push(data[i]);
            }
            this.loader.dismiss();
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })

  }
  doGetSearch() {
    this.api.get("table/z_channel_stream_detail", { params: { limit: 10000, filter: "name=" + "'" + this.anime + "' AND status='OPEN'", sort: "episode" + " DESC " } })
      .subscribe(val => {
        this.search = val['data']
      });
  }
  getSearch(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.channeldetail = this.search.filter(eps => {
        return eps.episode.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    } else {
      this.channeldetail = [];
      this.halaman = 0;
      this.doGetChannelDetail();
    }
  }
  doInfinite(infiniteScroll) {
    this.doGetChannelDetail().then(response => {
      infiniteScroll.complete();

    })
  }
  doRefresh(refresher) {
    this.doGetChannelDetail().then(response => {
      refresher.complete();
    })
  }
  goToPlayAnime(channel) {
    this.api.get("table/z_channel_stream_detail", { params: { limit: 1, filter: "id=" + "'" + channel.id + "'" } })
      .subscribe(val => {
        let data = val['data']
        const headers = new HttpHeaders()
          .set("Content-Type", "application/json");
        this.api.put("table/z_channel_stream_detail",
          {
            "id": channel.id,
            "click": data[0].click + 1
          },
          { headers })
          .subscribe(val => {
          });
      });
    this.navCtrl.push('PlayerPage', {
      url: channel.url,
      type: channel.type,
      stream: channel.stream,
      xml: channel.xml,
      thumbnail: channel.thumbnail_picture
    })
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

}
