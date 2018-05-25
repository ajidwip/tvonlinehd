import { Component } from '@angular/core';
import { App, AlertController, LoadingController, IonicPage, NavController, NavParams, Refresher, Alert } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UUID } from 'angular2-uuid';
import moment from 'moment';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-resultgame',
  templateUrl: 'resultgame.html',
})
export class ResultgamePage {
  public loader: any;
  public schedule = [];
  public datecurrent: any;
  public game:any;
  public idgame:any;
  public resultshome = [];
  public resultsaway = [];
  public lineups = [];

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public api: ApiProvider,
    public storage: Storage,
    public app: App,
    private http: HttpClient) {
    this.schedule = this.navParams.get('ScheduleAllActive');
    this.idgame = this.navParams.get('idgame');
    console.log(this.schedule)
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.game = 'result'
    this.loader.present();
    this.doGetResultsHome();
    this.doGetResultsAway();
    this.doGetLineups();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  ionViewDidEnter() {
    this.datecurrent = moment().format();
  }
  doGetResultsHome() {
    this.api.get('table/z_game_results', { params: { limit: 100, filter: "id_game=" + "'" + this.idgame + "'" + " AND type_stats='RESULTS' AND homeaway='HOME'", sort: "time_stats" + " ASC " } }).subscribe(val => {
      this.resultshome = val['data'];
      console.log(this.resultshome);
    });
  }
  doGetResultsAway() {
    this.api.get('table/z_game_results', { params: { limit: 100, filter: "id_game=" + "'" + this.idgame + "'" + " AND type_stats='RESULTS' AND homeaway='AWAY'", sort: "time_stats" + " ASC " } }).subscribe(val => {
      this.resultsaway = val['data'];
      console.log(this.resultsaway);
    });
  }
  doGetLineups() {
    this.api.get('table/z_game_lineups', { params: { limit: 100, filter: "id_game=" + "'" + this.idgame + "'", sort: "id" + " ASC " } }).subscribe(val => {
      this.lineups = val['data'];
      console.log(this.lineups);
    });
  }

}
