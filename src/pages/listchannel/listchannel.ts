import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-listchannel',
  templateUrl: 'listchannel.html',
})
export class ListchannelPage {

  public channels = [];
  public datecurrent: any;
  public datetimecurrent: any;
  public loader: any;
  public loading: any;
  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navParam: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });

    this.loading.present().then(() => {
      this.datecurrent = moment().format('YYYY-MM-DD');
      this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
      this.api.get("table/z_schedule_tv", { params: { limit: 1000, filter: "date=" + "'" + this.datecurrent + "'", group: 'channel', sort: "channel" + " ASC " } })
        .subscribe(val => {
          this.channels = val['data']
          let data = val['data'];
          for (let i = 0; i < data.length; i++) {

          };
          this.loading.dismiss()
        });
    });
  }
  doGotoSchedule(channel) {
    this.navCtrl.push('SchedulePage', {
      channel: channel.channel
    })
  }

}
