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
      content: 'Loading...'
    });
    this.loader.present().then(() => {
      /*var swiper = new Swiper('.swiper-container', {
        slidesPerView: 2,
        spaceBetween: 3,
        freeMode: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });*/
    });
    this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
    this.doGetLive();
    this.doGetListChannel();
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
      isTesting: false,
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
  doGetListChannel() {
    this.api.get("table/z_list_channel", { params: { filter: "status='OPEN'", limit: 100, sort: "name" + " ASC " } })
      .subscribe(val => {
        this.channellist = val['data']
      });
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doDetail(channel) {
    this.navCtrl.push('ChannelPage', {
      name: channel.name,
      category: channel.category
    })
  }
  doDetailLive(live) {
    this.navCtrl.push('ChannelPage', {
      name: live.category,
      category: live.type
    })
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
}
