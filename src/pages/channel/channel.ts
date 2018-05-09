import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {
  data:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = navParams.get('DataChannel')
    console.log('1',this.data)
  }


}
