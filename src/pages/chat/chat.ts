import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams, Content } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { UUID } from 'angular2-uuid';
import { HttpHeaders } from "@angular/common/http";
import moment from 'moment';
import { AdMobPro } from '@ionic-native/admob-pro';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  id: string = '';
  username: string = '';
  message: string = '';
  totalonline: any;
  public users = [];
  _chatSubscription;
  public messages = [];
  public useronline = [];
  @ViewChild(Content) content: Content
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public api: ApiProvider,
    public storage: Storage,
    private admob: AdMobPro,
    public platform: Platform) {

    /*platform.ready().then(() => {
      var admobid = {
        banner: 'ca-app-pub-7488223921090533/9446361096',
        interstitial: 'ca-app-pub-7488223921090533/9226869245'
      };

      this.admob.createBanner({
        adSize: 'CUSTOM',
        adId: admobid.banner,
        isTesting: true,
        autoShow: true,
        width: 400,
        height: 50,
        position: this.admob.AD_POSITION.TOP_CENTER
      })

      this.admob.prepareInterstitial({
        adId: admobid.interstitial,
        isTesting: true,
        autoShow: false
      })
    });*/
    this._chatSubscription = this.db.object('/chat').subscribe(data => {
      this.messages = Object.keys(data).map(i => data[i])
      this.api.get('table/z_users', { params: { filter: "status='ONLINE'" } })
        .subscribe(val => {
          this.useronline = val['data']
          this.totalonline = val['count']
        })
    })
  }
  sendMessage() {
    if (this.message == '') {

    }
    else {
      this.db.list('/chat').push({
        username: this.username,
        message: this.message
      }).then(() => {
      });
      this.message = '';
    }
  }
  ionViewWillEnter() {
    var admobid = {
      banner: 'ca-app-pub-7488223921090533/9446361096',
      interstitial: 'ca-app-pub-7488223921090533/9226869245'
    };

    this.admob.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: true,
      autoShow: true,
      // width: 360,
      // height: 50,
      position: this.admob.AD_POSITION.POS_XY,
      overlap: true,
      y: 80
    })

    this.admob.prepareInterstitial({
      adId: admobid.interstitial,
      isTesting: true,
      autoShow: false
    })
  }
  ionViewWillLeave() {
    this._chatSubscription.unsubscribe();
    this.db.list('/chat').push({
      specialMessage: true,
      message: `${this.username} has left the room`
    })
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.put("table/z_users",
      {
        "id": this.id,
        "last_online_chat": moment().format('YYYY-MM-DD h:mm:ss'),
        "status": 'OFFLINE'
      },
      { headers })
      .subscribe(val => {
        this.admob.removeBanner();
        this.admob.showInterstitial();
      })
  }
  ionViewDidLoad() {
    if (this.storage.length) {
      this.storage.get('users').then((val) => {
        this.users = val;
        if (this.users) {
          this.id = val.id;
          this.username = val.name;
          this.db.list('/chat').push({
            specialMessage: true,
            message: `${this.username} has joined the room`
          })
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_users",
            {
              "id": this.id,
              "last_online_chat": moment().format('YYYY-MM-DD h:mm:ss'),
              "status": "ONLINE"
            },
            { headers })
            .subscribe()
        }
      });
    }
  }
  callFunction() {
    this.content.scrollToBottom(0)
  }
  doShowOnline() {
    if (document.getElementById('chatMessages').style.display == 'none' && document.getElementById('content-online').style.display == 'block') {
      document.getElementById('chatMessages').style.display = 'block';
      document.getElementById('content-online').style.display = 'none'
    }
    else {
      document.getElementById('chatMessages').style.display = 'none';
      document.getElementById('content-online').style.display = 'block'
    }
  }

}
