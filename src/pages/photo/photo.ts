import { Component } from '@angular/core';
import { NavController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {
  public GalleryAllactive = [];
  halaman = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider) {
      
    this.doGetGalleryAllActive();
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
}
