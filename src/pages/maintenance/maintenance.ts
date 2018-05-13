import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import moment from 'moment';
import { ApiProvider } from '../../providers/api/api';


@IonicPage()
@Component({
  selector: 'page-maintenance',
  templateUrl: 'maintenance.html',
})
export class MaintenancePage {

  public ScheduleAllActive = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public app: App) {
  }

  doRefresh() {
    this.api.get('table/z_schedule', { params: { limit: 1, filter: "status='OPEN'" + " AND " + "date >=" + "'" + moment().format('YYYY-MM-DD') + "'", sort: "date" + " ASC " } })
      .subscribe(val => {
        this.ScheduleAllActive = val['data'];
        if (this.ScheduleAllActive.length == 0) {
          this.app.getRootNav().setRoot('MaintenancePage')
        }
        else {
          this.app.getRootNav().setRoot(TabsPage);
        }
      }, err => {
        
      });
  }

}
