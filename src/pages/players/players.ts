import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-players',
  templateUrl: 'players.html',
})
export class PlayersPage {
  public players = [];
  public staffs = [];
  public seasons = [];
  public seasonsall = [];
  public season = '';
  public loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private iab: InAppBrowser,
    public api: ApiProvider) {
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present();
    this.doGetSeason();
    this.doGetPlayers();
    this.doGetStaffs();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doGetSeason() {
    this.api.get('table/z_players', { params: { limit: 100, group: "season", sort: "season" + " DESC " } }).subscribe(val => {
      this.seasonsall = val['data'];
      this.season = this.seasonsall[0].season;
      this.api.get('table/z_players', { params: { limit: 100, filter: "season=" + "'" + this.season + "'", group: "season", sort: "season" + " DESC " } }).subscribe(val => {
        this.seasons = val['data'];
      });
    });
  }
  doGetPlayers() {
    this.api.get('table/z_players', { params: { limit: 100, filter: "position_group='PLAYER'", sort: "number" + " ASC " } }).subscribe(val => {
      this.players = val['data'];
    });
  }
  doGetStaffs() {
    this.api.get('table/z_players', { params: { limit: 100, filter: "position_group='STAFF'" } }).subscribe(val => {
      this.staffs = val['data'];
    });
  }

}
