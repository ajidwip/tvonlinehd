import { Component } from '@angular/core';
import { LoadingController, NavController, Platform, AlertController, ToastController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders } from "@angular/common/http";
import { AppVersion } from '@ionic-native/app-version';
import { StatusBar } from '@ionic-native/status-bar';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

// declare var Swiper: any;
declare var window: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myForm: FormGroup;
  public channellist = [];
  public channellive = [];
  public loader: any;
  public datetimecurrent: any;
  public nextno: any;
  public packagename: any;
  public appinfo = [];
  public listchannellive = [];
  public searchlive = [];
  public listchannelnotlive = [];
  public listchannelnotlivestream = [];
  public searchnotlive = [];
  public listchannellivedetail = [];
  public channelstream: any;
  public radiostream: any;
  public url: any;
  public id: any;
  public channels = [];
  public channelslive = [];
  public channellistall = [];
  public datashow: boolean = false;
  public ads: any;
  public list: boolean = true;
  public favorit = [];
  public mostwatch = [];
  public quality = [];
  public notlive = [];
  public livedetail = [];
  public qualityid: any;

  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public fb: FormBuilder,
    public appVersion: AppVersion,
    private statusBar: StatusBar,
    private uniqueDeviceID: UniqueDeviceID,
    public toastCtrl: ToastController,
    private youtube: YoutubeVideoPlayer,
    private admob: AdMobPro) {
    this.myForm = fb.group({
      comment: ['', Validators.compose([Validators.required])],
    })
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
    });
    this.loader.present().then(() => {
      this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
      this.doGetLive();
      this.doGetListChannel();
      this.doGetList();
      this.doGetMostWatched();
    });
  }
  ionViewDidLoad() {
  }
  getNextNoDevices() {
    return this.api.get('nextno/z_devices/id')
  }
  doGetArsips() {

  }
  ionViewDidEnter() {
    /*var admobid = {
      banner: 'ca-app-pub-7488223921090533/3868398990',
      interstitial: 'ca-app-pub-7488223921090533/2330836488'
    };

    this.admob.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: this.ads[0].testing,
      autoShow: true,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
    });*/
    this.mostwatch = [];
    this.doGetMostWatched();
    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_admob", { params: { limit: 100, filter: "appid=" + "'" + this.packagename + "' AND status='OPEN'" } })
        .subscribe(val => {
          this.ads = val['data']
        });
    }, (err) => {

    })
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.api.get("table/z_devices", { params: { limit: 100, filter: "uuid_device=" + "'" + uuid + "'" } })
          .subscribe(val => {
            let data = val['data']
            if (data.length == 0) {
              this.getNextNoDevices().subscribe(val => {
                this.nextno = val['nextno'];
                const headers = new HttpHeaders()
                  .set("Content-Type", "application/json");
                this.api.post("table/z_devices",
                  {
                    "id": this.nextno,
                    "uuid_device": uuid
                  },
                  { headers })
                  .subscribe(val => {
                  }, (err) => {

                  })
              });
            }
            else {
              this.favorit = [];
              this.api.get("table/z_arsip_users", { params: { limit: 1000, filter: "uuid_device=" + "'" + uuid + "' AND type_arsip='fav'", sort: "date" + " DESC " } })
                .subscribe(val => {
                  this.favorit = val['data']
                });
            }
          });
      })
      .catch((error: any) => console.log(error));
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }
  ionViewWillLeave() {
    //this.admob.removeBanner();
  }
  ngAfterViewInit() {
  }
  doGetListChannel() {
    this.api.get("table/z_list_channel", { params: { filter: "status='OPEN'", limit: 100, sort: "name" + " ASC " } })
      .subscribe(val => {
        this.channellist = val['data']
      }, err => {
        this.doGetListChannel();
      });
  }
  doDetailArsip() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.navCtrl.push('ChannelPage', {
          name: 'Arsip',
          category: 'ARSIP',
          type: 'GRID',
          stream: '',
          uuiddevices: uuid
        })
      })
      .catch((error: any) => console.log(error));
  }
  doDetailMostWatched() {
    this.navCtrl.push('ChannelPage', {
      name: 'Most Watched',
      category: 'MOSTWATCHED',
      type: 'GRID',
      stream: ''
    })
  }
  doDetail(channel) {
    this.navCtrl.push('ChannelPage', {
      name: channel.name,
      category: channel.category,
      type: channel.type,
      stream: channel.stream
    })
  }
  doDetailLive(live) {
    this.navCtrl.push('ChannelPage', {
      name: live.category,
      category: live.type,
      stream: live.stream
    })
  }
  doPreviewArsip(channeldetail) {
    if (channeldetail.type == 'STREAM') {
      this.api.get("table/z_channel_stream", { params: { limit: 1, filter: "id=" + "'" + channeldetail.id + "'" } })
        .subscribe(val => {
          let data = val['data']
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_channel_stream",
            {
              "id": channeldetail.id,
              "click": data[0].click + 1
            },
            { headers })
            .subscribe(val => {
            });
        });
    }
    else if (channeldetail.type == 'TV') {
      this.api.get("table/z_channel", { params: { limit: 1, filter: "id=" + "'" + channeldetail.id + "'" } })
        .subscribe(val => {
          let data = val['data']
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_channel",
            {
              "id": channeldetail.id,
              "click": data[0].click + 1
            },
            { headers })
            .subscribe(val => {
            });
        });
    }
    this.navCtrl.push('PreviewPage', {
      id: channeldetail.id,
      name: channeldetail.name,
      title: channeldetail.title,
      category: channeldetail.category,
      trailer: channeldetail.trailer,
      type: channeldetail.type,
      stream: channeldetail.stream,
      xml: channeldetail.xml,
      plugin: channeldetail.plugin,
      url: channeldetail.url,
      controls: channeldetail.controls
    })
  }
  doPreview(channeldetail) {
    if (channeldetail.type == 'STREAM') {
      this.api.get("table/z_channel_stream", { params: { limit: 1, filter: "id=" + "'" + channeldetail.id + "'" } })
        .subscribe(val => {
          let data = val['data']
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_channel_stream",
            {
              "id": channeldetail.id,
              "click": data[0].click + 1
            },
            { headers })
            .subscribe(val => {
            });
        });
    }
    else if (channeldetail.type == 'TV') {
      this.api.get("table/z_channel", { params: { limit: 1, filter: "id=" + "'" + channeldetail.id + "'" } })
        .subscribe(val => {
          let data = val['data']
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_channel",
            {
              "id": channeldetail.id,
              "click": data[0].click + 1
            },
            { headers })
            .subscribe(val => {
            });
        });
    }
    if (channeldetail.type == 'STREAM') {
      this.navCtrl.push('PreviewPage', {
        id: channeldetail.id,
        name: channeldetail.name,
        title: channeldetail.title,
        category: channeldetail.category,
        trailer: channeldetail.trailer,
        type: channeldetail.type,
        stream: channeldetail.stream,
        xml: channeldetail.xml,
        plugin: channeldetail.plugin,
        url: channeldetail.url,
        controls: channeldetail.controls
      })
    }
    else if (channeldetail.type == 'TV') {
      if (channeldetail.plugin == '1') {
        this.api.get("table/z_channel", { params: { limit: 30, filter: "id=" + "'" + channeldetail.id + "'" } })
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
              controls: channeldetail.controls // true(default)/false. Used to hide controls on fullscreen
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
        this.api.get("table/z_channel", { params: { limit: 30, filter: "id=" + "'" + channeldetail.id + "'" } })
          .subscribe(val => {
            let data = val['data']
            this.navCtrl.push('LivePage', {
              url: data[0].url,
              stream: channeldetail.stream,
              xml: channeldetail.xml,
              rotate: channeldetail.orientation,
              thumbnail: channeldetail.thumbnail_picture,
              subsbody1: channeldetail.subsbody_1,
              subsbody2: channeldetail.subsbody_2,
              subshead1: channeldetail.subshead_1,
              subshead2: channeldetail.subshead_2
            })
          });
      }
    }
  }
  doGetMostWatched() {
    this.api.get("table/z_channel_stream", { params: { filter: "status='OPEN'", limit: 8, sort: "click" + " DESC " } })
      .subscribe(val => {
        let data = val['data']
        for (let i = 0; i < data.length; i++) {
          this.mostwatch.push(data[i]);
        }
      }, err => {
        this.doGetMostWatched();
      });
  }
  doGetList() {
    this.api.get("table/z_list_channel", { params: { filter: "status='OPEN' AND (name LIKE 'TV%' OR category='STREAM')", limit: 100, sort: "name" + " ASC " } })
      .subscribe(val => {
        this.channellistall = val['data']
        let data = val['data']
        for (let i = 0; i < data.length; i++) {
          if (data[i].category == 'TV') {
            this.api.get("table/z_channel", { params: { filter: "status='OPEN' AND status_2 !='CLSD' AND name=" + "'" + data[i].name + "'", limit: 8, sort: "click" + " DESC " } })
              .subscribe(val => {
                let data = val['data']
                for (let i = 0; i < data.length; i++) {
                  this.channels.push(data[i]);
                }
              });
          }
          else {
            this.api.get("table/z_channel_stream", { params: { filter: "status='OPEN' AND name=" + "'" + data[i].name + "'", limit: 8, sort: "date" + " DESC " } })
              .subscribe(val => {
                let data = val['data']
                for (let i = 0; i < data.length; i++) {
                  this.channels.push(data[i]);
                }
              });
          }
        }
        this.loader.dismiss()
        this.datashow = true;
      }, err => {
        this.doGetList();
      });
  }
  doGetLive() {
    this.api.get("table/z_channel_live", { params: { limit: 10, filter: "status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
      .subscribe(val => {
        this.channellive = val['data']
      }, err => {
        this.doGetLive();
      });
  }
  doComment() {
    document.getElementById('header').style.display = 'none';
    document.getElementById('content').style.display = 'none';
    document.getElementById('comment').style.display = 'block';
  }
  doCloseComment() {
    document.getElementById('header').style.display = 'block';
    document.getElementById('content').style.display = 'block';
    document.getElementById('comment').style.display = 'none';
    this.myForm.reset();
  }
  doPostComment() {
    this.getNextNo().subscribe(val => {
      this.nextno = val['nextno'];
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
      this.api.post("table/z_comment",
        {
          "id": this.nextno,
          "comment": this.myForm.value.comment,
          "datetime": moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        { headers })
        .subscribe(val => {
          this.myForm.reset();
          let alert = this.alertCtrl.create({
            subTitle: 'Success',
            message: 'Terima kasih atas komen dan sarannya.',
            buttons: ['OK']
          });
          alert.present();
          this.doCloseComment();
        }, (err) => {
          let alert = this.alertCtrl.create({
            subTitle: 'Error',
            message: 'Submit error',
            buttons: ['OK']
          });
          alert.present();
        })
    });
  }
  getNextNo() {
    return this.api.get('nextno/z_comment/id')
  }
  doGoToPlaystore() {
    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_version", { params: { filter: "name=" + "'" + this.packagename + "'" } })
        .subscribe(val => {
          this.appinfo = val['data']
          if (this.appinfo.length) {
            window.location.href = this.appinfo[0].url
          }
        });
    }, err => {

    });
  }
  getSearch(ev: any) {
    let value = ev.target.value;

    if (value && value.trim() != '') {
      this.api.get("table/z_channel", { params: { limit: 500, filter: "status = 'OPEN'" } })
        .subscribe(val => {
          this.listchannelnotlive = val['data']
          this.searchnotlive = this.listchannelnotlive
          this.listchannelnotlive = this.searchnotlive.filter(notlive => {
            return notlive.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
          })
        });
    } else {
      this.listchannelnotlive = [];
    }
    if (value && value.trim() != '') {
      this.api.get("table/z_channel_stream", { params: { limit: 500, filter: "status = 'OPEN'" } })
        .subscribe(val => {
          this.listchannelnotlivestream = val['data']
          this.searchnotlive = this.listchannelnotlivestream
          this.listchannelnotlivestream = this.searchnotlive.filter(notlive => {
            return notlive.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
          })
        });
    } else {
      this.listchannelnotlivestream = [];
    }
    if (value && value.trim() != '') {
      this.api.get("table/z_channel_live", { params: { limit: 500, filter: "status = 'OPEN'" } })
        .subscribe(val => {
          this.listchannellive = val['data']
          this.searchlive = this.listchannellive
          this.listchannellive = this.searchlive.filter(live => {
            return live.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
          })
        });
    } else {
      this.listchannellive = [];
    }
  }
  doPlay(notlive) {
    this.channelstream = notlive.stream
    if ((notlive.type == 'STREAM' && notlive.name == 'Anime') || (notlive.type == 'STREAM' && notlive.name == 'Film Series')) {
      this.navCtrl.push('ChanneldetailPage', {
        anime: notlive.title
      })
    }
    else if (notlive.type == 'RADIO') {
      this.radiostream = this.radiostream ? false : true;
      this.url = notlive.url
      this.id = notlive.id
    }
    else if (notlive.plugin == '1') {
      this.api.get("table/z_channel", { params: { limit: 30, filter: "id=" + "'" + notlive.id + "'" } })
        .subscribe(val => {
          var self = this;
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
            controls: notlive.controls // true(default)/false. Used to hide controls on fullscreen
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
      if (notlive.type == 'TV') {
        this.api.get("table/z_channel", { params: { limit: 30, filter: "id=" + "'" + notlive.id + "'" } })
          .subscribe(val => {
            let data = val['data']
            this.navCtrl.push('LivePage', {
              url: data[0].url,
              stream: notlive.stream,
              xml: notlive.xml,
              rotate: notlive.orientation,
              subsbody1: notlive.subsbody_1,
              subsbody2: notlive.subsbody_2,
              subshead1: notlive.subshead_1,
              subshead2: notlive.subshead_2
            })
          });
      }
      else if (notlive.type == 'STREAM') {
        this.api.get("table/z_channel_stream", { params: { limit: 30, filter: "id=" + "'" + notlive.id + "'" } })
          .subscribe(val => {
            let data = val['data']
            this.navCtrl.push('LivePage', {
              url: data[0].url,
              stream: notlive.stream,
              xml: notlive.xml,
              rotate: notlive.orientation,
              subsbody1: notlive.subsbody_1,
              subsbody2: notlive.subsbody_2,
              subshead1: notlive.subshead_1,
              subshead2: notlive.subshead_2
            })
          });
      }
    }
  }
  doPlayLive(livedetail) {
    this.api.get("table/z_channel_live", { params: { limit: 30, filter: "id=" + "'" + livedetail.id + "'" } })
      .subscribe(val => {
        let data = val['data'];
        if (data[0].url && livedetail.plugin != '1') {
          this.navCtrl.push('LivePage', {
            url: data[0].url,
            stream: livedetail.stream,
            xml: livedetail.xml,
            rotate: livedetail.orientation,
            subsbody1: livedetail.subsbody_1,
            subsbody2: livedetail.subsbody_2,
            subshead1: livedetail.subshead_1,
            subshead2: livedetail.subshead_2
          })
        }
        else if (data[0].url && livedetail.plugin == '1') {
          var self = this;
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
            controls: livedetail.controls // true(default)/false. Used to hide controls on fullscreen
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
  doGrid() {
    this.list = false;
    document.getElementById('list').style.display = 'none'
    document.getElementById('grid').style.display = 'block'
  }
  doList() {
    this.list = true;
    document.getElementById('list').style.display = 'block'
    document.getElementById('grid').style.display = 'none'
  }
  doSports() {
    this.navCtrl.push('SportslivePage', {
      param: '0'
    })
  }
  doQuality(channeldetail) {
    this.qualityid = ''
    if (channeldetail.type == 'STREAM') {
      this.navCtrl.push('PreviewPage', {
        id: channeldetail.id,
        name: channeldetail.name,
        title: channeldetail.title,
        category: channeldetail.category,
        trailer: channeldetail.trailer,
        type: channeldetail.type,
        stream: channeldetail.stream,
        xml: channeldetail.xml,
        plugin: channeldetail.plugin,
        url: channeldetail.url,
        controls: channeldetail.controls
      })
    }
    else if (channeldetail.type == 'TV') {
      this.api.get("table/z_channel_url", { params: { limit: 10, filter: "id_channel=" + "'" + channeldetail.id + "'" + "AND status = 'OPEN'", sort: 'quality ASC' } })
        .subscribe(val => {
          this.quality = val['data']
          document.getElementById('quality').style.display = 'block';
        });
    }
  }
  doQualityNotLive(notlive) {
    if (notlive.type == 'STREAM') {
      this.navCtrl.push('PreviewPage', {
        id: notlive.id,
        name: notlive.name,
        title: notlive.title,
        category: notlive.category,
        trailer: notlive.trailer,
        type: notlive.type,
        stream: notlive.stream,
        xml: notlive.xml,
        plugin: notlive.plugin,
        url: notlive.url,
        controls: notlive.controls
      })
    }
    else if (notlive.type == 'TV') {
      this.api.get("table/z_channel_url", { params: { limit: 10, filter: "id_channel=" + "'" + notlive.id + "'" + "AND status = 'OPEN'", sort: 'quality ASC' } })
        .subscribe(val => {
          this.quality = val['data']
          document.getElementById('quality').style.display = 'block';
        });
    }
  }
  doQualityLive(livedetail) {
    this.api.get("table/z_channel_live_url", { params: { limit: 10, filter: "id_channel=" + "'" + livedetail.id + "'" + "AND status = 'OPEN'", sort: 'quality ASC' } })
      .subscribe(val => {
        this.quality = val['data']
        document.getElementById('quality').style.display = 'block';
      });
  }
  doCloseQuality() {
    document.getElementById('quality').style.display = 'none';
  }
  doSelectQuality() {
    console.log(this.qualityid)
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
      this.doCloseQuality()
      this.api.get("table/z_channel_url", { params: { limit: 10, filter: "id=" + "'" + this.qualityid + "'" } })
        .subscribe(val => {
          let data = val['data']
          if (data[0].plugin == '1') {
            this.api.get("table/z_channel", { params: { limit: 30, filter: "id=" + "'" + data[0].id + "'" } })
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
                  controls: data[0].controls // true(default)/false. Used to hide controls on fullscreen
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
          else if (data[0].plugin == '9') {
            let dataurl = data[0].url
            let url = dataurl.substring(30, 60)
            this.youtube.openVideo(url);
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
            this.api.get("table/z_channel", { params: { limit: 30, filter: "id=" + "'" + data[0].id + "'" } })
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
        });
    }
  }
  doPlayerLive() {
    this.api.get("table/z_channel_live", { params: { limit: 30, filter: "id=" + "'" + this.qualityid + "'" } })
      .subscribe(val => {
        let data = val['data'];
        if (data[0].url && data[0].plugin != '1') {
          this.navCtrl.push('LivePage', {
            url: data[0].url,
            stream: data[0].stream,
            xml: data[0].xml,
            rotate: data[0].orientation,
            subsbody1: data[0].subsbody_1,
            subsbody2: data[0].subsbody_2,
            subshead1: data[0].subshead_1,
            subshead2: data[0].subshead_2
          })
        }
        else if (data[0].url && data[0].plugin == '1') {
          var self = this;
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
            controls: data[0].controls // true(default)/false. Used to hide controls on fullscreen
          };
          window.plugins.streamingMedia.playVideo(videoUrl, options);
        }
        else if (data[0].url && data[0].plugin == '9') {
          let dataurl = data[0].url
          let url = dataurl.substring(30, 60)
          this.youtube.openVideo(url);
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
          let alert = this.alertCtrl.create({
            subTitle: 'Pertandingan belum dimulai',
            buttons: ['OK']
          });
          alert.present();
        }
      });
  }
}
