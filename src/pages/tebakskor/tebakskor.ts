import { Component } from '@angular/core';
import { App, AlertController, LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UUID } from 'angular2-uuid';
import moment from 'moment';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-tebakskor',
  templateUrl: 'tebakskor.html',
})
export class TebakskorPage {
  public ScheduleAllActive = [];
  public players = [];
  public datecurrent: any;
  public clubhome = '';
  public clubaway = '';
  public users = '';
  public email = '';
  public user = [];
  public prediction = [];
  public id = '';
  public uuid = '';
  public nextno = '';
  public skorhome: any;
  public skoraway: any;
  public dateprediction:any;
  public pencetakgol = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public api: ApiProvider,
    public storage: Storage,
    public alertCtrl: AlertController,
    public app: App,
    private http: HttpClient) {
    this.ScheduleAllActive = this.navParams.get('ScheduleAllActive')
    this.api.get('table/z_club', { params: { filter: "name=" + "'" + this.ScheduleAllActive[0].club_home + "'" } })
      .subscribe(val => {
        this.clubhome = val['data'][0].alias;
        this.api.get('table/z_club', { params: { filter: "name=" + "'" + this.ScheduleAllActive[0].club_away + "'" } })
          .subscribe(val => {
            this.clubaway = val['data'][0].alias;
          });
      });
    this.doGetPlayers();
    if (this.storage.length) {
      this.storage.get('users').then((val) => {
        this.users = val;
        if (this.users) {
          this.email = val.email;
          this.api.get('table/z_users', { params: { filter: "email=" + "'" + this.email + "'" } })
            .subscribe(val => {
              this.user = val['data']
              this.id = this.user[0].id;
              this.doGetPrediction();
            })
        }
      });
    }
  }
  ionViewDidEnter() {
    this.datecurrent = moment().format();
  }
  doGetPlayers() {
    this.api.get('table/z_players', { params: { limit: 100, filter: "position_group='PLAYER'", sort: "number" + " ASC " } }).subscribe(val => {
      this.players = val['data'];
    });
  }
  doGetPrediction() {
    this.api.get('table/z_prediction', { params: { filter: "id_game=" + "'" + this.ScheduleAllActive[0].id + "'" + " AND " + "id_user=" + "'" + this.id + "'" } }).subscribe(val => {
      this.prediction = val['data'];
      if (this.prediction.length != 0) {
        this.skorhome = this.prediction[0].prediction_skor_home;
        this.skoraway = this.prediction[0].prediction_skor_away;
        this.pencetakgol = this.prediction[0].prediction_first_scorer;
        this.dateprediction = this.prediction[0].date;
      }
    });
  }
  doSavePrediction() {
    let alert = this.alertCtrl.create({
      title: 'Konfirmasi',
      message: 'Kirim Prediksi?',
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

              this.api.post("table/z_prediction",
                {
                  "id": this.nextno,
                  "id_game": this.ScheduleAllActive[0].id,
                  "club_home": this.clubhome,
                  "club_away": this.clubhome,
                  "id_user": this.id,
                  "prediction_skor_home": this.skorhome,
                  "prediction_skor_away": this.skoraway,
                  "prediction_first_scorer": this.pencetakgol,
                  "date": date,
                  "uuid": this.uuid
                },
                { headers })
                .subscribe(
                  (val) => {
                    this.doGetPrediction();
                  });
            });
          }
        }
      ]
    });
    alert.present()
  }
  getNextNo() {
    return this.api.get('nextno/z_prediction/id')
  }

}
