import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { ApiProvider } from '../../providers/api/api';

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
    public api: ApiProvider) {
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
    this.api.get('table/z_image_link', { params: { filter: "uuid_parent=" + "'" + this.uuid + "'"} })
      .subscribe(val => {
        this.gallery = val['data'];
      });

  }

}
