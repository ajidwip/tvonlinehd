import { Component } from '@angular/core';
import { App, LoadingController, IonicPage, NavController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  public ScheduleAllActive = [];
  halaman = 0;
  public loader: any;
  public datecurrent:any;
  public league = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public loadingCtrl: LoadingController,
    public api: ApiProvider) {
    this.league = 'Semua Pertandingan';
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present();
    this.doGetScheduleAllActive();
  }
  ionViewDidEnter() {
    this.datecurrent = moment().format();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doGetScheduleAllActive() {
    if (this.league == 'Semua Pertandingan') {
      return new Promise(resolve => {
        let offset = 30 * this.halaman
        if (this.halaman == -1) {
          resolve();
        }
        else {
          this.halaman++;
          this.api.get('table/z_schedule', { params: { limit: 10, offset: offset,  filter: "status!='VERIFIKASI'", sort: "date" + " ASC " } })
            .subscribe(val => {
              let data = val['data'];
              for (let i = 0; i < data.length; i++) {
                this.ScheduleAllActive.push(data[i]);
              }
              if (data.length == 0) {
                this.halaman = -1
              }
              resolve();
            });
        }
      })
    }
    else {
      return new Promise(resolve => {
        let offset = 10 * this.halaman
        if (this.halaman == -1) {
          resolve();
        }
        else {
          this.halaman++;
          this.api.get('table/z_schedule', { params: { limit: 10, offset: offset,  filter: "status!='VERIFIKASI'" + " AND " + "league=" + "'" + this.league + "'", sort: "date" + " ASC " } })
            .subscribe(val => {
              let data = val['data'];
              for (let i = 0; i < data.length; i++) {
                this.ScheduleAllActive.push(data[i]);
              }
              if (data.length == 0) {
                this.halaman = -1
              }
              resolve();
            });
        }
      })
    }

  }
  selectLeague() {
    if (this.league == 'Semua Pertandingan') {
      this.api.get('table/z_schedule', { params: { limit: 10, filter: "status!='VERIFIKASI'", sort: "date" + " ASC " } }).subscribe(val => {
        this.ScheduleAllActive = val['data'];
      });
    }
    else {
      this.api.get('table/z_schedule', { params: { limit: 10, filter: "status!='VERIFIKASI'" + " AND " + "league=" + "'" + this.league + "'", sort: "date" + " ASC " } }).subscribe(val => {
        this.ScheduleAllActive = val['data'];
      });
    }
  }
  doInfinite(infiniteScroll) {
    this.doGetScheduleAllActive().then(response => {
      infiniteScroll.complete();

    })
  }
  doRefresh(refresher) {
    // this.api.get('table/z_schedule', { params: { limit: 10, filter: "status!='VERIFIKASI'", sort: "date" + " ASC " } }).subscribe(val => {
    //   this.ScheduleAllActive = val['data'];
    //   refresher.complete();
    // });
    this.doGetScheduleAllActive().then(response => {
      refresher.complete();

    })
  }
  doResultGame(schedule) {
    this.app.getRootNav().push('ResultgamePage', {
      ScheduleAllActive: schedule,
      idgame: schedule.id,
      league: schedule.league,
      round: schedule.round,
      clubhome: schedule.club_home,
      clubhomeurl: schedule.club_home_icon_url,
      clubaway: schedule.club_away,
      clubawayurl: schedule.club_away_icon_url,
      place: schedule.place
    });
  }
}
