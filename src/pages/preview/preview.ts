import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import { HttpHeaders } from "@angular/common/http";
import moment from 'moment';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { AppVersion } from '@ionic-native/app-version';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

declare var window;

@IonicPage()
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html',
})
export class PreviewPage {
  public packagename: any;
  public ads: any;
  public loader: any;
  public id: any;
  public name: any;
  public title: any;
  public category: any;
  public trailer: any;
  public type: any;
  public stream: any;
  public xml: any;
  public plugin: any;
  public url: any;
  public controls: any;
  public nextno: any;
  public inifavorit = [];

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
    private uniqueDeviceID: UniqueDeviceID,
    private admob: AdMobPro) {
    this.loader = this.loadingCtrl.create({

    });
    this.loader.present().then(() => {
      this.id = this.navParam.get('id')
      this.name = this.navParam.get('name')
      this.title = this.navParam.get('title')
      this.category = this.navParam.get('category')
      this.type = this.navParam.get('type')
      this.stream = this.navParam.get('stream')
      this.xml = this.navParam.get('xml')
      this.plugin = this.navParam.get('plugin')
      this.url = this.navParam.get('url')
      this.controls = this.navParam.get('controls')
      let trailer = this.navParam.get('trailer')
      let trailersubs = trailer.substring(32, 60)
      this.trailer = 'https://www.youtube.com/embed/' + trailersubs + '?autoplay=0&showinfo=0&controls=0'
      console.log(this.title, this.category, this.stream, this.trailer)
      setTimeout(() => {
        this.loader.dismiss();
      }, 3000);
      this.uniqueDeviceID.get()
        .then((uuid: any) => {
          this.api.get("table/z_arsip_users", { params: { limit: 30, filter: "id_channel=" + "'" + this.id + "'" } })
            .subscribe(val => {
              this.inifavorit = val['data']
            });
        }, (err) => {
        })
        .catch((error: any) => console.log(error));
    });
  }
  ngAfterViewInit() {
  }
  doPlay() {
    if ((this.type == 'STREAM' && this.name == 'Anime') || (this.type == 'STREAM' && this.name == 'Film Series')) {
      this.navCtrl.push('ChanneldetailPage', {
        anime: this.title
      })
    }
    else if (this.plugin == '1') {
      this.api.get("table/z_channel", { params: { limit: 30, filter: "id=" + "'" + this.id + "'" } })
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
            controls: this.controls // true(default)/false. Used to hide controls on fullscreen
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
      if (this.type == 'TV') {
        this.api.get("table/z_channel", { params: { limit: 30, filter: "id=" + "'" + this.id + "'" } })
          .subscribe(val => {
            let data = val['data']
            this.navCtrl.push('LivePage', {
              url: data[0].url,
              stream: data[0].stream,
              xml: data[0].xml,
              rotate: data[0].orientation,
              thumbnail: data[0].thumbnail_picture,
              subsbody1: data[0].subsbody_1,
              subsbody2: data[0].subsbody_2,
              subshead1: data[0].subshead_1,
              subshead2: data[0].subshead_2
            })
          });
      }
      else if (this.type == 'STREAM') {
        this.api.get("table/z_channel_stream", { params: { limit: 30, filter: "id=" + "'" + this.id + "'" } })
          .subscribe(val => {
            let data = val['data']
            this.navCtrl.push('LivePage', {
              url: data[0].url,
              stream: data[0].stream,
              xml: data[0].xml,
              rotate: data[0].orientation,
              thumbnail: data[0].thumbnail_picture
            })
          });
      }
    }
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
    });
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }
  ionViewWillLeave() {
    this.admob.removeBanner();
  }
  getNextNoArsip() {
    return this.api.get('nextno/z_arsip_users/id')
  }
  doFav() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        let date = moment().format('YYYY-MM-DD HH:mm');
        this.getNextNoArsip().subscribe(val => {
          this.nextno = val['nextno'];
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.post("table/z_arsip_users",
            {
              "id": this.nextno,
              "uuid_device": uuid,
              "type": 'fav',
              "id_channel": this.id,
              "date": date
            },
            { headers })
            .subscribe(val => {
              this.inifavorit = [];
              this.api.get("table/z_arsip_users", { params: { limit: 30, filter: "id_channel=" + "'" + this.id + "'" } })
                .subscribe(val => {
                  this.inifavorit = val['data']
                });
            }, (err) => {

            })
        });
      })
      .catch((error: any) => console.log(error));
  }

}
