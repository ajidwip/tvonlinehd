import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  username: string = '';
  message: string = '';
  public users = [];
  _chatSubscription;
  public messages = [];
  @ViewChild(Content) content: Content
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public storage: Storage) {
    if (this.storage.length) {
      this.storage.get('users').then((val) => {
        this.users = val;
        if (this.users) {
          this.username = val.name;
        }
      });
    }
    this._chatSubscription = this.db.object('/chat').subscribe(data => {
      this.messages = Object.keys(data).map(i => data[i])
    })
  }
  sendMessage() {
    this.db.list('/chat').push({
      username: this.username,
      message: this.message
    }).then(() => {
    });
    this.message = '';
  }
  // ionViewWillLeave() {
  //   this._chatSubscription.unsubscribe();
  //   this.db.list('/chat').push({
  //     specialMessage: true,
  //     message: `${this.username} has left the room`
  //   })
  // }
  // ionViewDidLoad() {
  //   this.db.list('/chat').push({
  //     specialMessage: true,
  //     message: `${this.username} has joined the room`
  //   })
  // }
  callFunction() {
    this.content.scrollToBottom(0)
  }

}
