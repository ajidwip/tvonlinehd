import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {
  public channels = [];
  public channeldetail = [];
  public channelcategory: any;
  public channelname: any;
  public loader: any;
  public url:any;
  public id:any;
  public radiostream:boolean;
  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navParam: NavParams,
    public loadingCtrl: LoadingController,
    private admob: AdMobPro) {
    this.radiostream = false;
    this.loader = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loader.present()
    this.channelcategory = this.navParam.get('category')
    this.channelname = this.navParam.get('name')
    if (this.channelcategory == 'TV') {
      this.api.get("table/z_channel", { params: { limit: 100, filter: "name=" + "'" + this.channelname + "' AND status='OPEN'", sort: "title" + " ASC " } })
        .subscribe(val => {
          this.channels = val['data']
        });
    }
    else if (this.channelcategory == 'STREAM') {
      this.api.get("table/z_channel_stream", { params: { limit: 500, filter: "name=" + "'" + this.channelname + "' AND status='OPEN'", sort: "title" + " ASC " } })
        .subscribe(val => {
          this.channels = val['data']
        });
    }
    else if (this.channelcategory == 'LIVE') {
      this.api.get("table/z_channel_live", { params: { limit: 100, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'", group: "date", sort: "date" + " ASC " } })
        .subscribe(val => {
          let data = val['data'];
          for (let i = 0; i < data.length; i++) {
            this.channels.push(data[i]);
            this.api.get("table/z_channel_live", { params: { limit: 100, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND " + "date=" + "'" + data[i].date + "'", sort: "date" + " ASC " } })
              .subscribe(val => {
                this.channeldetail = val['data']
              });
          }
        });
    }
    else if (this.channelcategory == 'RADIO') {
      this.api.get("table/z_channel_radio", { params: { limit: 500, filter: "status='OPEN'", sort: "title" + " ASC " } })
        .subscribe(val => {
          this.channels = val['data']
        });
    }
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doPlay(channel) {
    if (channel.type == 'STREAM') {
      this.navCtrl.push('ChanneldetailPage', {
        anime: channel.title
      })
    }
    else if (channel.type == 'RADIO') {
      this.radiostream = this.radiostream ? false : true;
      this.url = channel.url
      this.id = channel.id
    }
    else {
      this.navCtrl.push('LivePage', {
        url: channel.url
      })
    }
  }

}
