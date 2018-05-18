import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'

@IonicPage()
@Component({
  selector: 'page-nobar',
  templateUrl: 'nobar.html',
})
export class NobarPage {
  public nobars = [];
  public regional = [];
  public regionalall = [];
  public region = '';
  public loader: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public api: ApiProvider) {
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present();
    this.doGetRegional();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doGetRegional() {
    this.api.get('table/z_regional', { params: { limit: 100, sort: "regional" + " ASC " } }).subscribe(val => {
      this.regionalall = val['data'];
      this.region = this.regionalall[0].regional;
      this.api.get('table/z_nobar', { params: { limit: 100, filter: "regional=" + "'" + this.region + "'",  sort: "regional" + " ASC " } }).subscribe(val => {
        this.nobars = val['data'];
      });
    });
  }
  doGetSelectRegional() {
    this.api.get('table/z_regional', { params: { limit: 100, sort: "regional" + " ASC " } }).subscribe(val => {
      this.regional = val['data'];
    });
  }
  doGetNobar(region) {
    this.api.get('table/z_nobar', { params: { limit: 100, filter: "regional=" + "'" + region + "'",  sort: "regional" + " ASC " } }).subscribe(val => {
      this.nobars = val['data'];
    });
  }
}
