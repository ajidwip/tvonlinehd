import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ChatPage } from "../chat/chat";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  username: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {

  }

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['OK']
    })
    alert.present();
  }

  loginUser() {
    if (/^[a-zA-Z0-9]+$/.test(this.username)) {
      this.navCtrl.push(ChatPage, {
        username: this.username
      })
    }
    else {
      this.showAlert('Error', 'Invalid Username');
    }
  }

}
