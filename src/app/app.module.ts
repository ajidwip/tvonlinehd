import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChatPage } from '../pages/chat/chat';
import { TabsPage } from '../pages/tabs/tabs';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { ContentPhotoComponent } from '../components/content-photo/content-photo';
import { ContentVideoComponent } from '../components/content-video/content-video';
import { ContentNewsComponent } from '../components/content-news/content-news';

var config = {
  apiKey: "AIzaSyBYa6NgqtjCTvrKX3o_4NDpKSol64PwcD4",
  authDomain: "barcainfo-5eee1.firebaseio.com",
  databaseURL: "https://barcainfo-5eee1.firebaseio.com",
  projectId: "barcainfo-5eee1",
  storageBucket: "barcainfo-5eee1.appspot.com",
  messagingSenderId: "798397482932"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChatPage,
    TabsPage,
    ContentNewsComponent,
    ContentPhotoComponent,
    ContentVideoComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChatPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
