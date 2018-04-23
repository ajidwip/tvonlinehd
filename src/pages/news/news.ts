import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})

export class NewsPage {
  public NewsAllactive = [];
  public NewsTop = [];
  public title = '';
  public image = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider) {
    this.doGetNewsAllActive();
  }

  doGetNewsAllActive() {
    this.api.get('table/z_content_news', { params: { filter: "status='OPEN'", sort: "id" + " DESC " } })
      .subscribe(val => {
        this.NewsTop = val['data'];
        this.title = this.NewsTop[0].title;
        this.image = this.NewsTop[0].image_url;
        this.api.get('table/z_content_news', { params: { filter: "status='OPEN' AND image_url!=" + "'" + this.image + "'", sort: "id" + " DESC " } })
          .subscribe(val => {
            this.NewsAllactive = val['data'];
          });
      });
  }

}
