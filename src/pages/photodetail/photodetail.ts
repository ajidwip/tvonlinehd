import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';

@IonicPage()
@Component({
  selector: 'page-photodetail',
  templateUrl: 'photodetail.html',
})
export class PhotodetailPage {
  public gallery = [];
  public id = '';
  public title = '';
  public image = '';
  public uuid = '';
  public date: any;
  public formatdate: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public admob: AdMobPro) {
    this.id = this.navParams.get('id');
    this.title = this.navParams.get('title');
    this.image = this.navParams.get('image');
    this.date = this.navParams.get('date');
    this.uuid = this.navParams.get('uuid');
    this.formatdate = moment(this.date).calendar();
    this.doGetGallery();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotodetailPage');
  }
  doGetGallery() {
    this.api.get('table/z_image_link', { params: { filter: "uuid_parent=" + "'" + this.uuid + "'" } })
      .subscribe(val => {
        this.gallery = val['data'];
      });

  }
  ionViewDidEnter() {
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
