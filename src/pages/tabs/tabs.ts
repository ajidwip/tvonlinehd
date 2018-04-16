import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { ChatPage } from '../../pages/chat/chat';
import { NewsPage } from '../../pages/news/news';
import { PhotoPage } from '../../pages/photo/photo';
import { VideoPage } from '../../pages/video/video';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  home = HomePage;
  news = NewsPage;
  photo = PhotoPage;
  video = VideoPage;
  chat = ChatPage;
  myindex: number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
