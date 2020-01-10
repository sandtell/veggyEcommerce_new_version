// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { ViewController, ModalController, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
// import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HttpClient } from '@angular/common/http';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { TermServicesPage } from '../term-services/term-services';
import { RefundPolicyPage } from '../refund-policy/refund-policy';
import { TranslateService } from '@ngx-translate/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Md5 } from 'ts-md5';
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  formData = {
    customers_firstname: '',
    customers_lastname: '',
    email: '',
    password: '',
    customers_telephone: '',
    customers_picture: '',
    consumer_key: "",
    consumer_secret: "",
    consumer_nonce: "",
    consumer_device_id: 'device id of the app',
    image_id: 0
  };
  image = "";
  errorMessage = '';
  consumerKeyEncript: any;
  consumerSecretEncript: any;
  constructor(
    public httpClient: HttpClient,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public platform: Platform,
    public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController,
    public transfer: FileTransfer,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    // private camera: Camera
  ) {
    this.shared.currentOpenedModel = this;

    this.consumerKeyEncript = Md5.hashStr(this.config.consumerKey);
    this.consumerSecretEncript = Md5.hashStr(this.config.consumerSecret);
  }
  //openActionSheet() {
    // this.translate.get(["Camera", "Gallery", "Cancel", "Choose"]).subscribe((res) => {
    //   const actionSheet = this.actionSheetCtrl.create({
    //     buttons: [
    //       {
    //         text: res["Camera"],
    //         icon: 'camera',
    //         handler: () => {
    //           this.openCamera("camera");
    //           console.log('Destructive clicked');
    //         }
    //       }, {
    //         text: res["Gallery"],
    //         icon: 'image',
    //         handler: () => {
    //           this.openCamera("gallery");
    //           console.log('Archive clicked');
    //         }
    //       }, {
    //         text: res["Cancel"],
    //         icon: 'close',
    //         role: 'cancel',
    //         handler: () => {
    //           console.log('Cancel clicked');
    //         }
    //       }
    //     ]
    //   });
    //   actionSheet.present();
    // });
//  }
  openCamera(type) {
    // this.loading.autoHide(1000);
    // let source = this.camera.PictureSourceType.CAMERA;
    // if (type == 'gallery')
    //   source = this.camera.PictureSourceType.PHOTOLIBRARY;

    // const options: CameraOptions = {
    //   quality: 50,
    //   sourceType: source,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   allowEdit: true,
    //   saveToPhotoAlbum: false,
    //   correctOrientation: true,
    //   targetHeight: 100,
    //   targetWidth: 100
    // }
    // this.platform.ready().then(() => {

    //   this.camera.getPicture(options).then((imageData) => {
    //     // imageData is either a base64 encoded string or a file URI
    //     // If it's base64:
    //     this.image = imageData;
    //     console.log(this.image);
    //     // this.uploadImage();
    //   }, (err) => { });
    // });
  }
  registerUser() {
    //this.loading.show();
    this.httpClient.post(this.config.url + 'processregistration', this.formData).subscribe((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.shared.login(data.data[0]);
        //this.config.customerData = data.data[0];
        this.viewCtrl.dismiss();
      }
      if (data.success == 0) {
        this.errorMessage = data.message;
      }
    });
  }
  signUp() {
    //this.registerUser()
    this.errorMessage = '';
    //this.formData.customers_picture = this.image;
    // if (this.image != "")
    //   this.uploadImage();
    // else {
    //   this.shared.toast("Please Add User Profile Image!");
    // }
    this.registerUser();
  }
  uploadImage() {
    this.loading.show();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let d = new Date();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'file',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {
        'consumer-key': this.consumerKeyEncript,
        'consumer-secret': this.consumerSecretEncript,
        'consumer-nonce': d.getTime().toString(),
        'consumer-device-id': 'device id of the app',
      }
    }
    //var array = this.image.split("?");
    fileTransfer.upload(this.image, this.config.url + 'uploadimage', options)
      .then((data) => {
        //console.log(data); //{"success":"1","data":[{"id":185,"image_id":95,"image_type":"ACTUAL","height":64,"width":64,"path":"images\/media\/2019\/08\/jWCC801512.png","created_at":null,"updated_at":null}],"message":"image is uploaded successfully."}
        let result = JSON.parse(data.response);
        if (result.success == 1) {
          this.formData.image_id = result.data[0].image_id;
          this.registerUser();
          //this.shared.login(result.data[0]);
          //this.config.customerData = data.data[0];
          // this.viewCtrl.dismiss();
        }
        if (result.success == 0) {
          this.registerUser();
          this.errorMessage = result.message;
          //this.shared.toast("error= " + this.errorMessage);
        }
      }, (err) => {
        this.registerUser();
        console.log(err);
        //this.shared.toast("error= " + JSON.stringify(err));
      });
  }
  openPrivacyPolicyPage() {
    let modal = this.modalCtrl.create(PrivacyPolicyPage);
    modal.present();
  }
  openTermServicesPage() {
    let modal = this.modalCtrl.create(TermServicesPage);
    modal.present();
  }
  openRefundPolicyPage() {
    let modal = this.modalCtrl.create(RefundPolicyPage);
    modal.present();
  }
  dismiss() {
    this.viewCtrl.dismiss();
    this.shared.currentOpenedModel = null;
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SignUpPage');
  // }
}
