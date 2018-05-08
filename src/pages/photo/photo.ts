import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';

@IonicPage()
@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {
  public GalleryAllactive = [];
  halaman = 0;
  public loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    private admobphoto: AdMobPro) {
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present();
    this.doGetGalleryAllActive();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doGetGalleryAllActive() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/z_content_photos', { params: { limit: 10, offset: offset, filter: "status='OPEN'", sort: "id" + " DESC " } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.GalleryAllactive.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })

  }
  doInfinite(infiniteScroll) {
    this.doGetGalleryAllActive().then(response => {
      infiniteScroll.complete();

    })
  }
  doRefresh(refresher) {
    this.api.get("table/z_content_photos", { params: { limit: 10, filter: "status='OPEN'", sort: "id" + " DESC " } }).subscribe(val => {
      this.GalleryAllactive = val['data'];
      refresher.complete();
    });
  }
  doGoGalleryDetail(gallery) {
    this.navCtrl.push('PhotodetailPage', {
      id: gallery.id,
      title: gallery.title,
      image: gallery.image_url_thumb,
      date: gallery.date,
      uuid: gallery.uuid
    });
  }
  ionViewDidEnter() {
    var admobid = {
      banner: 'ca-app-pub-7488223921090533/9446361096',
      interstitial: 'ca-app-pub-7488223921090533/9226869245'
    };

    this.admobphoto.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: true,
      autoShow: true,
      position: this.admobphoto.AD_POSITION.BOTTOM_CENTER,
    });
  }
  ionViewWillLeave() {
    this.admobphoto.removeBanner();
  }
}
