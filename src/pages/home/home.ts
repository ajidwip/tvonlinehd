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
  /*ngAfterViewInit() {
    this.content.ionScroll.subscribe((event) => {
      this.scroll = event.scrollTop
      console.log(this.scroll)
      if(this.scroll == 0) {
        document.getElementById('header').style.opacity = '1'
        document.getElementById('header').style.height = 'auto'
        document.getElementById('header').style.transition = 'opacity 0.5s'
        document.getElementById('header-sticky').style.opacity = '0'
        document.getElementById('header-sticky').style.height = '0'
        document.getElementById('content').style.marginTop = "0px";
        document.getElementById('news').style.paddingTop = "0px";
      }
      else {
        document.getElementById('header').style.opacity = '0'
        document.getElementById('header').style.height = '0'
        document.getElementById('header-sticky').style.opacity = '1'
        document.getElementById('header-sticky').style.height = 'auto'
        document.getElementById('content').style.marginTop = "-120px";
        document.getElementById('news').style.paddingTop = "20px";
      }
    });
  }*/
  ngAfterViewInit() {
    this.content.ionScroll.subscribe((event) => {
      this.scroll = event.scrollTop
      console.log(this.scroll)
      if (this.scroll == 0) {
        document.getElementById('header-navbar').style.height = 'auto'
        document.getElementById('header-navbar').style.opacity = '1'
        document.getElementById('content').style.marginTop = "0px";
        document.getElementById('news').style.paddingTop = "0px";
      }
      else {
        document.getElementById('header-navbar').style.height = '0'
        document.getElementById('header-navbar').style.opacity = '0'
        document.getElementById('header-navbar').style.transition = 'height 1s'
        document.getElementById('content').style.marginTop = "-40px";
        document.getElementById('content').style.height = "105%";
        document.getElementById('news').style.paddingTop = "85px";
      }
      if(this.scroll > 100){
        document.getElementById('container-img').style.height = '70px'
        document.getElementById('container-img').style.transition = 'height 1s'
        document.getElementById('content').style.marginTop = "-90px";
        document.getElementById('content').style.height = "112%";
        document.getElementById('news').style.paddingTop = "190px";
      }
      else {
        document.getElementById('container-img').style.height = 'auto'
      }
    });
  }
}
