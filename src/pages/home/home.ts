import { Component, ViewChild } from '@angular/core';
import { Platform, Slides, Content, NavController, NavParams, AlertController, LoadingController, App } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { DomSanitizer } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import moment from 'moment';

declare var Swiper: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild(Content) content: Content;
  username: string = '';
  scroll: any = 0;
  state: string = 'x';
  private data: any;
  private start: number = 0;
  private end: number = 5;
  public NewsAllactive = [];
  public GalleryAllactive = [];
  public VideosAllactive = [];
  public ScheduleAllActive = [];
  public loader: any;
  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public api: ApiProvider,
    public sanitizer: DomSanitizer,
    public app: App,
    private iab: InAppBrowser) {
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present().then(() => {
      var swiper = new Swiper('.swiper-container', {
        slidesPerView: 1.2,
        spaceBetween: 10,
        freeMode: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    });
    this.doGetNewsAllActive();
    this.doGetGalleryAllActive();
    this.doGetVideosAllActive();
    this.doGetScheduleAllActive();
  }
  doDashboard() {
    this.app.getRootNav().setRoot('DashboardPage');
  }
  doMoreNews() {
    this.app.getRootNav().setRoot('NewsPage');
  }
  doMoreGallery() {
    this.app.getRootNav().setRoot('PhotoPage');
  }
  doMoreVideos() {
    this.app.getRootNav().setRoot('VideoPage');
  }
  doSchedule() {
    this.app.getRootNav().setRoot('CalendarPage');
  }
  doOpenVideo(video) {
    const browser = this.iab.create(video.video_url, '_blank', 'location=no');
  }
  doGetNewsAllActive() {
    this.api.get('table/z_content_news', { params: { filter: "status='OPEN'", sort: "id" + " DESC " } })
      .subscribe(val => {
        this.NewsAllactive = val['data'];
      });

  }
  doGetGalleryAllActive() {
    this.api.get('table/z_content_photos', { params: { filter: "status='OPEN'", sort: "id" + " DESC " } })
      .subscribe(val => {
        this.GalleryAllactive = val['data'];
      });
  }
  doGetVideosAllActive() {
    this.api.get('table/z_content_videos', { params: { filter: "status='OPEN'", sort: "id" + " DESC " } })
      .subscribe(val => {
        this.VideosAllactive = val['data'];
      });
  }
  doGetScheduleAllActive() {
    this.api.get('table/z_schedule', { params: { limit: 1, filter: "status='OPEN'" + " AND " + "date >=" + moment().format('YYYY-MM-DD') , sort: "date" + " ASC " } })
      .subscribe(val => {
        this.ScheduleAllActive = val['data'];
      });
  }
  doGoNewsDetail(news) {
    this.navCtrl.push('NewsdetailPage', {
      id: news.id,
      title: news.title,
      description: news.description,
      image: news.image_url,
      sumber: news.sumber,
      date: news.date
    });
  }
  doGoGalleryDetail(gallery) {
    this.navCtrl.push('PhotodetailPage', {
      id: gallery.id,
      title: gallery.title,
      image: gallery.image_url_thumb,
      date: gallery.date,
      uuid: gallery.uuid
    });
  }
  ionViewWillLeave() {
    document.getElementById('container-img').style.height = 'auto'
    document.getElementById('header-navbar').style.height = 'auto'
    document.getElementById('header-navbar').style.opacity = '1'
    document.getElementById('content').style.marginTop = '0%'
    document.getElementById('content').style.height = '100%'
    document.getElementById('statistics').style.display = 'block'
    document.getElementById('name-clubleft').style.display = 'block'
    document.getElementById('name-clubright').style.display = 'block'
    document.getElementById('logo-clubleft').style.width = '40%'
    document.getElementById('logo-clubright').style.width = '40%'
    document.getElementById('result').style.display = 'block'
    document.getElementById('result-sticky').style.display = 'none'
    document.getElementById('centered-left').style.left = 'auto'
    document.getElementById('centered-left').style.top = '20%'
    document.getElementById('centered-right').style.right = 'auto'
    document.getElementById('centered-right').style.top = '20%'
    this.content.scrollToTop(0)
  }

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['OK']
    })
    alert.present();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
    this.content.ionScroll.subscribe((event) => {
      this.scroll = event.scrollTop
      if (this.scroll == 0) {
        document.getElementById('header-navbar').style.height = 'auto'
        document.getElementById('header-navbar').style.opacity = '1'
        document.getElementById('content').style.marginTop = '0%'
        document.getElementById('content').style.height = '100%'

      }
      else {
        document.getElementById('header-navbar').style.height = '0'
        document.getElementById('header-navbar').style.opacity = '0'
        document.getElementById('header-navbar').style.transition = 'height 1s'
        document.getElementById('content').style.marginTop = '-12%'
        document.getElementById('content').style.height = '110%'

      }
      if (this.scroll > 100) {
        document.getElementById('container-img').style.height = '65px'
        document.getElementById('container-img').style.transition = 'height 1s'
        document.getElementById('statistics').style.display = 'none'
        document.getElementById('name-clubleft').style.display = 'none'
        document.getElementById('name-clubright').style.display = 'none'
        document.getElementById('logo-clubleft').style.width = '30%'
        document.getElementById('logo-clubright').style.width = '30%'
        document.getElementById('result').style.display = 'none'
        document.getElementById('result-sticky').style.display = 'block'
        document.getElementById('centered-left').style.left = '12%'
        document.getElementById('centered-left').style.top = '25%'
        document.getElementById('centered-right').style.right = '12%'
        document.getElementById('centered-right').style.top = '25%'
        document.getElementById('content').style.marginTop = '-24%'
        document.getElementById('content').style.height = '114%'

      }
      else if (this.scroll == 0) {
        document.getElementById('header-navbar').style.height = 'auto'
        document.getElementById('header-navbar').style.opacity = '1'
        document.getElementById('content').style.marginTop = '0%'
        document.getElementById('content').style.height = '100%'
      }
      else {
        document.getElementById('container-img').style.height = 'auto'
        document.getElementById('statistics').style.display = 'block'
        document.getElementById('name-clubleft').style.display = 'block'
        document.getElementById('name-clubright').style.display = 'block'
        document.getElementById('logo-clubleft').style.width = '40%'
        document.getElementById('logo-clubright').style.width = '40%'
        document.getElementById('result').style.display = 'block'
        document.getElementById('result-sticky').style.display = 'none'
        document.getElementById('centered-left').style.left = 'auto'
        document.getElementById('centered-left').style.top = '20%'
        document.getElementById('centered-right').style.right = 'auto'
        document.getElementById('centered-right').style.top = '20%'
      }
    });
  }
}
