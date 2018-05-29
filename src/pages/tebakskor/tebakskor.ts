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
  public winners = [];
  public id = '';
  public name = '';
  public uuid = '';
  public nextno = '';
  public skorhome: any;
  public skoraway: any;
  public dateprediction: any;
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
    console.log('schedule',this.ScheduleAllActive)
    this.api.get('table/z_club', { params: { filter: "name=" + "'" + this.ScheduleAllActive[0].club_home + "'" } })
      .subscribe(val => {
        this.clubhome = val['data'][0].alias;
        this.api.get('table/z_club', { params: { filter: "name=" + "'" + this.ScheduleAllActive[0].club_away + "'" } })
          .subscribe(val => {
            this.clubaway = val['data'][0].alias;
          });
      });
    this.doGetPlayers();
    this.doGetWinners();
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
                  "club_away": this.clubaway,
                  "id_user": this.id,
                  "name_user": this.name,
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
  doGetWinners() {
    this.api.get('table/z_prediction', { params: { limit: 2, filter: "id_game=" + "'" + this.ScheduleAllActive[0].id + "'" + " AND " + "prediction_skor_home=" + this.ScheduleAllActive[0].skor_home + " AND " + "prediction_skor_away=" + this.ScheduleAllActive[0].skor_away, sort: "date ASC" } })
    .subscribe(val => {
      this.winners = val['data'];
      console.log('winners',this.winners)
    });
  }
  doProfile(winner) {
    this.app.getRootNav().push('ProfilePage', {
      userid: winner.id_user
    });
  }

}
