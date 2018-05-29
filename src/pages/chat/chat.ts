import { Directive, HostListener, Component, ViewChild, ElementRef } from '@angular/core';
import { App, LoadingController, IonicPage, Platform, NavController, NavParams, Content } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { UUID } from 'angular2-uuid';
import { HttpHeaders } from "@angular/common/http";
import moment from 'moment';
import { AdMobPro } from '@ionic-native/admob-pro';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
@Directive({
  selector: "ion-textarea[autoresize]" // Attribute selector
})
export class ChatPage {
  id: string = '';
  username: string = '';
  message: string = '';
  totalonline: any;
  public users = [];
  _chatSubscription;
  public messages = [];
  public useronline = [];
  public email = '';
  public picture = '';
  public time: any;
  public loader: any;

  @ViewChild(Content) content: Content
  @HostListener("input", ["$event.target"])
  onInput = (textArea: HTMLTextAreaElement): void => {
    this.adjust();
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public api: ApiProvider,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    private admobchat: AdMobPro,
    public platform: Platform,
    public app: App,
    public element: ElementRef) {
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present().then(() => {
      this._chatSubscription = this.db.object('/chat').subscribe(data => {
        this.messages = Object.keys(data).map(i => data[i])
        this.api.get('table/z_users', { params: { filter: "status='ONLINE'" } })
          .subscribe(val => {
            this.useronline = val['data']
            this.totalonline = val['count']
          })
      })
      this.loader.dismiss();
    });
  }
  ngOnInit(): void {
    const waitThenAdjust = (trial: number): void => {
      if (trial > 10) {
        // Give up.
        return;
      }

      const ta = this.element.nativeElement.querySelector("textarea");
      if (ta !== undefined && ta !== null) {
        this.adjust();
      }
      else {
        setTimeout(() => {
          waitThenAdjust(trial + 1);
        }, 0);
      }
    };

    // Wait for the textarea to properly exist in the DOM, then adjust it.
    waitThenAdjust(1)
  }

  adjust = (): void => {
    const ta = this.element.nativeElement.querySelector("textarea");
    if (ta !== undefined && ta !== null) {
      ta.style.overflow = "hidden";
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }
  sendMessage() {
    if (this.message == '') {

    }
    else {
      this.db.list('/chat').push({
        username: this.username,
        message: this.message,
        email: this.email,
        picture: this.picture,
        time: moment().format('YYYY-MM-DD h:mm')
      }).then(() => {
      });
      this.message = '';
      this.element.nativeElement.querySelector("textarea").style.height = "auto"
    }
  }
  ionViewDidEnter() {
    var admobid = {
      banner: 'ca-app-pub-7488223921090533/9446361096',
      interstitial: 'ca-app-pub-7488223921090533/9226869245'
    };

    this.admobchat.prepareInterstitial({
      adId: admobid.interstitial,
      isTesting: true,
      autoShow: false
    })
  }
  ionViewWillLeave() {
    this._chatSubscription.unsubscribe();
    this.db.list('/chat').push({
      specialMessage: true,
      message: `${this.username} has left the room`
    })
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.put("table/z_users",
      {
        "id": this.id,
        "last_online_chat": moment().format('YYYY-MM-DD h:mm:ss'),
        "status": 'OFFLINE'
      },
      { headers })
      .subscribe(val => {
        // this.admob.removeBanner();
        this.admobchat.showInterstitial();
      })
  }
  ionViewDidLoad() {
    if (this.storage.length) {
      this.storage.get('users').then((val) => {
        this.users = val;
        if (this.users) {
          this.id = val.id;
          this.username = val.name;
          this.email = val.email;
          this.picture = val.picture;
          this.db.list('/chat').push({
            specialMessage: true,
            message: `${this.username} has joined the room`
          })
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_users",
            {
              "id": this.id,
              "last_online_chat": moment().format('YYYY-MM-DD h:mm:ss'),
              "status": "ONLINE"
            },
            { headers })
            .subscribe()
        }
      });
    }
  }
  callFunction() {
    this.content.scrollToBottom(0)
  }
  doShowOnline() {
    if (document.getElementById('chatMessages').style.display == 'none' && document.getElementById('content-online').style.display == 'block') {
      document.getElementById('chatMessages').style.display = 'block';
      document.getElementById('content-online').style.display = 'none'
    }
    else {
      document.getElementById('chatMessages').style.display = 'none';
      document.getElementById('content-online').style.display = 'block'
    }
  }
  doProfile(user) {
    this.app.getRootNav().push('ProfilePage', {
      userid: user.id
    });
    console.log(user)
  }

}
