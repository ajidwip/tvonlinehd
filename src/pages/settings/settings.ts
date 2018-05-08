import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { HttpHeaders } from "@angular/common/http";
import { Md5 } from 'ts-md5/dist/md5';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public users = [];
  public user = [];
  public id = '';
  public firstname = '';
  public lastname = '';
  public email = '';
  public imageurl = '';
  public password = '';
  public loader: any;
  public firstnameboolean: any;
  public lastnameboolean: any;
  public emailboolean: any;
  public passwordboolean: any;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public api: ApiProvider,
    public navParams: NavParams) {
    this.firstnameboolean = true;
    this.lastnameboolean = true;
    this.emailboolean = true;
    this.passwordboolean = true;
    if (this.storage.length) {
      this.storage.get('users').then((val) => {
        this.users = val;
        if (this.users) {
          this.email = val.email;
          this.api.get('table/z_users', { params: { filter: "email=" + "'" + this.email + "'" } })
            .subscribe(val => {
              this.user = val['data']
              this.id = this.user[0].id;
              this.firstname = this.user[0].first_name;
              this.lastname = this.user[0].last_name;
              this.password = this.user[0].password;
              this.imageurl = this.user[0].image_url;
            })
        }
      });
    }
  }
  doUpdateFirstName() {
    this.firstnameboolean = false;
  }
  doSaveFirstName() {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");

    this.api.put("table/z_users",
      {
        "id": this.id,
        "first_name": this.firstname
      },
      { headers })
      .subscribe(val => {
        this.firstnameboolean = true;
      })
  }
  doUpdateLastName() {
    this.lastnameboolean = false;
  }
  doSaveLastName() {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");

    this.api.put("table/z_users",
      {
        "id": this.id,
        "last_name": this.lastname
      },
      { headers })
      .subscribe(val => {
        this.lastnameboolean = true;
      });
  }
  doUpdateEmail() {
    this.emailboolean = false;
  }
  doSaveEmail() {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");

    this.api.put("table/z_users",
      {
        "id": this.id,
        "email": this.email
      },
      { headers })
      .subscribe(val => {
        this.emailboolean = true;
      });
  }
  doUpdatePassword() {
    this.passwordboolean = false;
  }
  doSavePassword() {
    let password = Md5.hashStr(this.password);
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");

    this.api.put("table/z_users",
      {
        "id": this.id,
        "password": password
      },
      { headers })
      .subscribe(val => {
        this.passwordboolean = true;
      });
  }
}
