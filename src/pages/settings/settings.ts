import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { HttpHeaders } from "@angular/common/http";
import { Md5 } from 'ts-md5/dist/md5';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
  imageURI: string = '';
  imageFileName: string = '';
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public api: ApiProvider,
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
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
  getImage() {
    let options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI
    }
    options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY
    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.imageFileName = this.imageURI;
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }
  uploadFile() {
    if (this.imageURI == '') return;
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'fileToUpload',
      fileName: this.id,
      chunkedMode: true,
      mimeType: "image/jpeg",
      headers: {}
    }

    let url = "http://10.10.10.7/webapi5/api/Upload";
    fileTransfer.upload(this.imageURI, url, options)
      .then((data) => {
        loader.dismiss();
        const headers = new HttpHeaders()
          .set("Content-Type", "application/json");

        this.api.put("table/z_users",
          {
            "id": this.id,
            "image_url": 'http://101.255.60.202/webapi5/img/' + this.id
          },
          { headers })
          .subscribe(
            (val) => {
              this.presentToast("Upload berhasil");
              this.api.get('table/z_users', { params: { filter: "email=" + "'" + this.email + "'" } })
                .subscribe(val => {
                  this.user = val['data']
                  this.id = this.user[0].id;
                  this.firstname = this.user[0].first_name;
                  this.lastname = this.user[0].last_name;
                  this.password = this.user[0].password;
                  this.imageurl = this.user[0].image_url;
                })
            });
        this.imageURI = '';
        this.imageFileName = '';
      }, (err) => {
        console.log(err);
        loader.dismiss();
        this.presentToast(err);
      });
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
