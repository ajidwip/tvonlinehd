import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {
  public VideosAllactive = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    private iab: InAppBrowser) {
    this.doGetVideosAllActive();
  }

  doGetVideosAllActive() {
    this.api.get('table/z_content_videos', { params: { filter: "status='OPEN'", sort: "id" + " DESC " } })
      .subscribe(val => {
        this.VideosAllactive = val['data'];
      });
  }
  doOpenVideo(video) {
    const browser = this.iab.create(video.video_url, '_blank', 'location=no');
  }

}
