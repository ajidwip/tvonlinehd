import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { AppVersion } from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html',
})
export class PreviewPage {
  public packagename: any;
  public ads: any;
  public loader: any;
  public title: any;
  public category: any;
  public stream: any;
  public trailer: any;

  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navParam: NavParams,
    public appVersion: AppVersion,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private androidFullScreen: AndroidFullScreen,
    private admob: AdMobPro) {
    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_admob", { params: { limit: 100, filter: "appid=" + "'" + this.packagename + "' AND status='OPEN'" } })
        .subscribe(val => {
          this.ads = val['data']
        });
    }, (err) => {
    });
    this.loader = this.loadingCtrl.create({

    });
    this.loader.present().then(() => {
      this.title = this.navParam.get('title')
      this.category = this.navParam.get('category')
      this.stream = this.navParam.get('stream')
      let trailer = this.navParam.get('trailer')
      let trailersubs = trailer.substring(32, 60)
      this.trailer = '//www.youtube.com/embed/' + trailersubs + '?autoplay=0&showinfo=0&controls=0'
      console.log(this.title, this.category, this.stream, this.trailer)
      setTimeout(() => {
        this.loader.dismiss();
      }, 3000);
    });
  }
  ngAfterViewInit() {
  }

}
