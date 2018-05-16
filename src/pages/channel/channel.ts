import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { AdMobPro } from '@ionic-native/admob-pro';

@IonicPage()
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {

  public streaming = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    private admobnews: AdMobPro) {
    this.doGetLive();
  }

  doGetLive() {
    this.api.get('table/z_streaming', { params: { filter: "status='OPEN'" } })
      .subscribe(val => {
        this.streaming = val['data']
      });
  }

}
