import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  public date:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = this.navParams.get('id');
    this.title = this.navParams.get('title');
    this.description = this.navParams.get('description');
    this.image = this.navParams.get('image');
    this.date = this.navParams.get('date');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsdetailPage');
  }

}
