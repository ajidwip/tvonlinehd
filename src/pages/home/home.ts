import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, AlertController } from 'ionic-angular';
import { ChatPage } from "../chat/chat";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild(Content) content: Content;
  username: string = '';
  scroll: any = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController) {

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
  ngAfterViewInit() {
    this.content.ionScroll.subscribe((event) => {
      this.scroll = event.scrollTop
      console.log(this.scroll)
      if(this.scroll == 0) {
        document.getElementById('header').style.display = 'block'
        document.getElementById('header-sticky').style.visibility = 'hidden'
        document.getElementById('content').style.marginTop = "0px";
        document.getElementById('news').style.paddingTop = "0px";
      }
      else {
        document.getElementById('header').style.display = 'none'
        document.getElementById('header-sticky').style.visibility = 'visible'
        document.getElementById('content').style.marginTop = "-120px";
        document.getElementById('news').style.paddingTop = "50px";
      }
    });
  }
}
