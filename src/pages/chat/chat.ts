import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  username: string = '';
  message: string = '';
  _chatSubscription;
  messages: object[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase) {
    this.username = this.navParams.get('username')
    this._chatSubscription = this.db.object('/chat').subscribe(data => {
      console.log(data)
      this.messages = data;
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
  ionViewWillLeave() {
    this._chatSubscription.unsubscribe();
    this.db.list('/chat').push({
      specialMessage: true,
      message: '${this.username} has left the room'
    })
  }
  ionViewDidLoad() {
    this.db.list('/chat').push({
      specialMessage: true,
      message: '${this.username} has joined the room'
    })
  }

}
