import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-newsdetail',
  templateUrl: 'newsdetail.html',
})
export class NewsdetailPage {
  public news = [];
  public id = '';
  public title = '';
  public description = '';
  public image = '';
  public sumber = '';
  public date: any;
  public formatdate: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private admob: AdMobPro) {
    this.id = this.navParams.get('id');
    this.title = this.navParams.get('title');
    this.description = this.navParams.get('description');
    this.image = this.navParams.get('image');
    this.sumber = this.navParams.get('sumber');
    this.date = this.navParams.get('date');
    this.formatdate = moment(this.date).calendar();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsdetailPage');
  }
  ionViewWillEnter() {
    var admobid = {
      banner: 'ca-app-pub-7488223921090533/9446361096',
      interstitial: 'ca-app-pub-7488223921090533/9226869245'
    };

    this.admob.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: true,
      autoShow: true,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
    });
  }
  ionViewWillLeave() {
    this.admob.removeBanner();
  }
}
