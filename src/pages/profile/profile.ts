import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userid = '';
  public users = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider) {
    this.userid = this.navParams.get('userid');
    this.api.get('table/z_users', { params: { filter: "id=" + "'" + this.userid + "'" } })
      .subscribe(val => {
        this.users = val['data']
        console.log(this.users)
      });
  }

}
