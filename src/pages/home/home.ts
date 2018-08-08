import { Component } from '@angular/core';
import { LoadingController, NavController, Platform, AlertController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders } from "@angular/common/http";
import { AppVersion } from '@ionic-native/app-version';

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

  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public fb: FormBuilder,
    public appVersion: AppVersion,
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
    });
  }
  ionViewDidLoad() {
  }
  ionViewDidEnter() {
    /*var admobid = {
      banner: 'ca-app-pub-7488223921090533/3868398990',
      interstitial: 'ca-app-pub-7488223921090533/2330836488'
    };

    this.admob.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: true,
      autoShow: true,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
    });*/
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
      });
  }
  doDetail(channel) {
    this.navCtrl.push('ChannelPage', {
      name: channel.name,
      category: channel.category,
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
  doGetList() {
    this.api.get("table/z_list_channel", { params: { filter: "status='OPEN' AND (name LIKE 'TV%' OR category='STREAM')", limit: 100, sort: "name" + " ASC " } })
      .subscribe(val => {
        this.channellistall = val['data']
        let data = val['data']
        for (let i = 0; i < data.length; i++) {
          if (data[i].category == 'TV') {
            this.api.get("table/z_channel", { params: { filter: "status='OPEN' AND name=" + "'" + data[i].name + "'", limit: 8, sort: "click" + " DESC " } })
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
      });
  }
  doGetLive() {
    this.api.get("table/z_channel_live", { params: { limit: 10, filter: "status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
      .subscribe(val => {
        this.channellive = val['data']
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
            controls: notlive.controls // true(default)/false. Used to hide controls on fullscreen
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
          var videoUrl = data[0].url;
          var options = {
            successCallback: function () {
              var admobid = {
                banner: 'ca-app-pub-7488223921090533/8319723789',
                interstitial: 'ca-app-pub-7488223921090533/6830564057'
              };

              this.admob.prepareInterstitial({
                adId: admobid.interstitial,
                isTesting: true,
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
  doModal() {
    document.getElementById('modal').style.display = 'block';
  }
  doCloseModal() {
    document.getElementById('modal').style.display = 'none';
  }
}
