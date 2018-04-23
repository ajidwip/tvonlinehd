import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-photodetail',
  templateUrl: 'photodetail.html',
})
export class PhotodetailPage {
  public gallery = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.gallery = this.navParams.get('gallery');
    console.log(this.gallery)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotodetailPage');
  }

}
