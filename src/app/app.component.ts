import { Component } from '@angular/core';
import { Events, MenuController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  public users = [];
  public name = '';
  public email = '';
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public storage: Storage,
    public events: Events) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    events.subscribe('user:login', (users, time) => {
      this.users = users;
      this.name = users.name;
      this.email = users.email;
    });
    if (this.storage.length) {
      this.storage.get('users').then((val) => {
        this.users = val;
        this.name = val.name;
        this.email = val.email;
      });
    }
  }
  doLogin() {
    this.rootPage = LoginPage;
    this.menuCtrl.close();
  }
  doLogout() {
    this.users = [];
    this.name = '';
    this.email = '';
    this.storage.remove('users')
  }
  doHome() {
    this.rootPage = TabsPage;
    this.menuCtrl.close();
  }

}

