import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { AdMobPro } from '@ionic-native/admob-pro';
import moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders } from "@angular/common/http";
import { AppVersion } from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  myForm: FormGroup;
  public nextno: any;
  public packagename: any;
  public appinfo = [];
  public loader: any;
  public param:any;
  public name:any;
  constructor(
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public fb: FormBuilder,
    public appVersion: AppVersion,
    public navParams: NavParams,
    private admob: AdMobPro) {
    this.myForm = fb.group({
      comment: ['', Validators.compose([Validators.required])],
    })
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      
    });
    this.param = this.navParams.get('param')
    if (this.param == '0') {
      this.name = 'Saran & Komentar'
    }
    else {
      this.name = 'Request Film & Anime'
    }
    this.loader.present().then(() => {
    
    });
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doPostComment() {
    this.getNextNo().subscribe(val => {
      this.nextno = val['nextno'];
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
      this.api.post("table/z_comment",
        {
          "id": this.nextno,
          "comment": this.myForm.value.comment,
          "datetime": moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        { headers })
        .subscribe(val => {
          this.myForm.reset();
          let alert = this.alertCtrl.create({
            subTitle: 'Success',
            message: 'Terima kasih atas komen dan sarannya.',
            buttons: ['OK']
          });
          alert.present();
        }, (err) => {
          let alert = this.alertCtrl.create({
            subTitle: 'Error',
            message: 'Submit error',
            buttons: ['OK']
          });
          alert.present();
        })
    });
  }
  getNextNo() {
    return this.api.get('nextno/z_comment/id')
  }
  doGoToPlaystore() {
    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_version", { params: { filter: "name=" + "'" + this.packagename + "'" } })
        .subscribe(val => {
          this.appinfo = val['data']
          if (this.appinfo.length) {
            window.location.href = this.appinfo[0].url
          }
        });
    }, err => {

    });
  }

}
