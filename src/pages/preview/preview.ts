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
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

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
  public report = [];
  public quality = [];
  public qualityid: any;

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
    private youtube: YoutubeVideoPlayer,
    private admob: AdMobPro) {
    this.loader = this.loadingCtrl.create({

    });
    // this.loader.present().then(() => {
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
    let link = trailer.substring(0, 22)
    this.trailer = trailersubs
    // this.trailer = link + '/embed/' + trailersubs + '?autoplay=0&showinfo=0&controls=0'
    /*setTimeout(() => {
      this.loader.dismiss();
    }, 3000);*/
    this.api.get("table/z_report_url", { params: { limit: 30, filter: "id_channel=" + "'" + this.id + "' AND (name LIKE '%Film%' OR name LIKE '%Anime%')" } })
      .subscribe(val => {
        this.report = val['data']
      });
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.api.get("table/z_arsip_users", { params: { limit: 30, filter: "id=" + "'" + this.id + "' AND uuid_device=" + "'" + uuid + "'" } })
          .subscribe(val => {
            this.inifavorit = val['data']
          });
      }, (err) => {
      })
      .catch((error: any) => console.log(error));
    //});
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
          var self = this
          let data = val['data']
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
                    "id_channel": data[0].id,
                    "name": data[0].name,
                    "title": data[0].title,
                    "url": data[0].url,
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
    return this.api.get('nextno/z_arsip_users/id_device')
  }
  doFav() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        let date = moment().format('YYYY-MM-DD HH:mm');
        if (this.inifavorit.length != 0) {
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.delete("table/z_arsip_users", { params: { filter: "id_device=" + "'" + this.inifavorit[0].id_device + "'" }, headers })
            .subscribe(val => {
              this.inifavorit = [];
              this.api.get("table/z_arsip_users", { params: { limit: 30, filter: "id=" + "'" + this.id + "' AND uuid_device=" + "'" + uuid + "'" } })
                .subscribe(val => {
                  this.inifavorit = val['data']
                });
            });
        }
        else {
          this.api.get("table/z_channel_stream", { params: { limit: 30, filter: "id=" + "'" + this.id + "'" } })
            .subscribe(val => {
              let data = val['data']
              this.getNextNoArsip().subscribe(val => {
                this.nextno = val['nextno'];
                const headers = new HttpHeaders()
                  .set("Content-Type", "application/json");
                this.api.post("table/z_arsip_users",
                  {
                    "id_device": this.nextno,
                    "uuid_device": uuid,
                    "type_arsip": 'fav',
                    "id": data[0].id,
                    "name": data[0].name,
                    "stream": data[0].stream,
                    "category": data[0].category,
                    "type": data[0].type,
                    "controls": data[0].controls,
                    "xml": data[0].xml,
                    "plugin": data[0].plugin,
                    "title": data[0].title,
                    "thumbnail_picture": data[0].thumbnail_picture,
                    "trailer": data[0].trailer,
                    "url": data[0].url,
                    "date": date
                  },
                  { headers })
                  .subscribe(val => {
                    this.inifavorit = [];
                    this.api.get("table/z_arsip_users", { params: { limit: 30, filter: "id=" + "'" + this.id + "' AND uuid_device=" + "'" + uuid + "'" } })
                      .subscribe(val => {
                        this.inifavorit = val['data']
                      });
                  }, (err) => {

                  })
              });
            });
        }
      })
      .catch((error: any) => console.log(error));
  }
  doReport() {
    this.api.get("table/z_report_url", { params: { limit: 30, filter: "id_channel=" + "'" + this.id + "' AND (name LIKE '%Film%' OR name LIKE '%Anime%')" } })
      .subscribe(val => {
        let data = val['data']
        if (data.length != 0) {
          let alert = this.alertCtrl.create({
            subTitle: 'URL ini dilaporkan tidak aktif oleh seseorang dan sedang dalam pengecekan admin',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          let alert = this.alertCtrl.create({
            title: 'Konfirmasi Laporan',
            message: 'Apakah anda yakin URL ini tidak aktif?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {

                }
              },
              {
                text: 'Yes',
                handler: () => {
                  this.api.get("table/z_channel_stream", { params: { limit: 30, filter: "id=" + "'" + this.id + "'" } })
                    .subscribe(val => {
                      let data = val['data']
                      this.api.get('nextno/z_report_url/id').subscribe(val => {
                        let nextno = val['nextno'];
                        const headers = new HttpHeaders()
                          .set("Content-Type", "application/json");
                        this.api.post("table/z_report_url",
                          {
                            "id": nextno,
                            "id_channel": data[0].id,
                            "name": data[0].name,
                            "title": data[0].title,
                            "url": data[0].url,
                            "date": moment().format('YYYY-MM-DD HH:mm:ss'),
                          },
                          { headers })
                          .subscribe(val => {
                            let toast = this.toastCtrl.create({
                              message: 'Report has been sent',
                              duration: 3000
                            });
                            toast.present();
                            this.report = [];
                            this.api.get("table/z_report_url", { params: { limit: 30, filter: "id_channel=" + "'" + this.id + "' AND (name LIKE '%Film%' OR name LIKE '%Anime%')" } })
                              .subscribe(val => {
                                this.report = val['data']
                              });
                          });
                      });
                    });
                }
              }
            ]
          });
          alert.present();
        }
      });
  }
  doPlayYoutube() {
    this.youtube.openVideo(this.trailer);
  }
  doCloseQuality() {
    document.getElementById('qualitys').style.display = 'none';
  }
  doSelectQuality() {
    console.log(this.qualityid)
  }
  doQuality() {
    this.qualityid = '';
    if ((this.type == 'STREAM' && this.name == 'Anime') || (this.type == 'STREAM' && this.name == 'Film Series')) {
      this.navCtrl.push('ChanneldetailPage', {
        anime: this.title
      })
    }
    else {
      this.api.get("table/z_channel_stream_url", { params: { limit: 10, filter: "id_channel=" + "'" + this.id + "'" + "AND status = 'OPEN'", sort: 'quality ASC' } })
        .subscribe(val => {
          this.quality = val['data']
          document.getElementById('qualitys').style.display = 'block';
        });
    }
  }
  doPlayer() {
    if (this.qualityid === '') {
      let alert = this.alertCtrl.create({
        subTitle: 'Silahkan pilih server terlebih dahulu !!!',
        buttons: ['OK']
      });
      alert.present();
    }
    else {
      this.doCloseQuality();
      this.api.get("table/z_channel_stream_url", { params: { limit: 10, filter: "id=" + "'" + this.qualityid + "'" } })
        .subscribe(val => {
          let data = val['data']
          if (data[0].plugin == '1') {
            var self = this
            let data = val['data']
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
                      "id_channel": data[0].id,
                      "name": data[0].name,
                      "title": data[0].title,
                      "url": data[0].url,
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
          }
          else {
            if (this.type == 'STREAM') {
              this.navCtrl.push('LivePage', {
                url: data[0].url,
                stream: data[0].stream,
                xml: data[0].xml,
                rotate: data[0].orientation,
                thumbnail: data[0].thumbnail_picture
              })
            }
          }
        });
    }
  }

}
