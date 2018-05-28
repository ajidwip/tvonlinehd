import { Component } from '@angular/core';
import { App, AlertController, LoadingController, IonicPage, NavController, NavParams, Refresher, Alert } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UUID } from 'angular2-uuid';
import moment from 'moment';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-nobar',
  templateUrl: 'nobar.html',
})
export class NobarPage {
  public nobars = [];
  public regional = [];
  public regionalall = [];
  public nobarusers = [];
  public user = [];
  public region = '';
  public loader: any;
  public nextno = '';
  public uuid = '';
  public email = '';
  public users: any;
  public id = '';
  public name = '';
  public picture = '';
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public api: ApiProvider,
    public storage: Storage,
    public app: App,
    private http: HttpClient) {
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present();
    /*this.getNobarUsers();*/
    if (this.storage.length) {
      this.storage.get('users').then((val) => {
        this.users = val;
        if (this.users) {
          this.email = val.email;
          this.api.get('table/z_users', { params: { filter: "email=" + "'" + this.email + "'" } })
            .subscribe(val => {
              this.user = val['data']
              this.id = this.user[0].id;
              this.name = this.user[0].first_name + " " + this.user[0].last_name;
              this.email = this.user[0].email;
              this.picture = this.user[0].image_url;
              this.region = this.user[0].region;
            })
        }
      });
    }
    this.doGetRegional();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doGetRegional() {
    if (this.id) {
      this.api.get('table/z_nobar', { params: { limit: 100, filter: "regional=" + "'" + this.region + "'", sort: "regional" + " ASC " } }).subscribe(val => {
        this.nobars = val['data'];
      });
    }
    else {
      this.api.get('table/z_regional', { params: { limit: 100, sort: "regional" + " ASC " } }).subscribe(val => {
        this.regionalall = val['data'];
        this.region = this.regionalall[0].regional;
        this.api.get('table/z_nobar', { params: { limit: 100, filter: "regional=" + "'" + this.region + "'", sort: "regional" + " ASC " } }).subscribe(val => {
          this.nobars = val['data'];
        });
      });
    }
  }
  doGetSelectRegional() {
    this.api.get('table/z_regional', { params: { limit: 100, sort: "regional" + " ASC " } }).subscribe(val => {
      this.regional = val['data'];
    });
  }
  doGetNobar(region) {
    this.api.get('table/z_nobar', { params: { limit: 100, filter: "regional=" + "'" + region + "'", sort: "regional" + " ASC " } }).subscribe(val => {
      this.nobars = val['data'];
    });
  }
  /*doDatangNobar(nobar) {
    if (this.email == '') {
      this.app.getRootNav().setRoot('LoginPage');
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Info',
        message: 'Anda ingin datang di Nobar ini?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {

            }
          },
          {
            text: 'OK',
            handler: () => {
              this.getNextNo().subscribe(val => {
                this.nextno = val['nextno'];
                let uuid = UUID.UUID();
                this.uuid = uuid;
                let date = moment().format('YYYY-MM-DD h:mm:ss');
                const headers = new HttpHeaders()
                  .set("Content-Type", "application/json");

                this.api.post("table/z_nobar_users",
                  {
                    "id": this.nextno,
                    "nobar_id": nobar.id,
                    "user_id": this.id,
                    "name": this.name,
                    "image_url": this.picture,
                    "date": date,
                    "uuid": this.uuid
                  },
                  { headers })
                  .subscribe(
                    (val) => {
                      this.getNobarUsers();
                    });
              });
            }
          }
        ]
      });
      alert.present()
    }
  }
  getNextNo() {
    return this.api.get('nextno/z_nobar_users/id')
  }
  getNobarUsers() {
    this.api.get('table/z_nobar_users', { params: { filter: "user_id=" + "'" + this.id + "'"} }).subscribe(val => {
      this.nobarusers = val['data'];
    });
  }*/
}
