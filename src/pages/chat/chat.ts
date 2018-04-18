import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { UUID } from 'angular2-uuid';
import { HttpHeaders } from "@angular/common/http";
import moment from 'moment';

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
    public storage: Storage) {
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
      .subscribe()
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
