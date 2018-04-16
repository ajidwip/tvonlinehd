import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ChatPage } from '../pages/chat/chat';
import { NewsPage } from '../pages/news/news';
import { PhotoPage } from '../pages/photo/photo';
import { VideoPage } from '../pages/video/video';
import { ContentPhotoComponent } from '../components/content-photo/content-photo';
import { ContentVideoComponent } from '../components/content-video/content-video';
import { ContentNewsComponent } from '../components/content-news/content-news';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularfire2';
import firebase from 'firebase';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { IonicStorageModule } from '@ionic/storage';
import { ApiProvider } from '../providers/api/api';
import { HttpClientModule } from '@angular/common/http';

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
    TabsPage,
    LoginPage,
    ChatPage,
    NewsPage,
    PhotoPage,
    VideoPage,
    ContentNewsComponent,
    ContentPhotoComponent,
    ContentVideoComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    ChatPage,
    NewsPage,
    PhotoPage,
    VideoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    ApiProvider
  ]
})
export class AppModule {}
