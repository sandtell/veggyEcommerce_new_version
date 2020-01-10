// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { Platform, NavController, ActionSheetController } from 'ionic-angular';
// import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertProvider } from '../../providers/alert/alert';
import { LoadingProvider } from '../../providers/loading/loading';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { HttpClient } from '@angular/common/http';
import { FileTransferObject, FileUploadOptions, FileTransfer } from '@ionic-native/file-transfer';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {
  myAccountData = {
    customers_firstname: '',
    customers_lastname: '',
    phone: '',
    currentPassword: '',
    password: '',
    customers_dob: '',
    customers_old_picture: '',
    customers_id: '',
    customers_picture: '',
    image_id: 0,
    customers_telephone: ""
  };
  profilePicture = '';
  passwordData: { [k: string]: any } = {};
  placeholder: string = 'assets/placeholder.png';
  consumerKeyEncript: any;
  consumerSecretEncript: any;
  constructor(
    public httpClient: HttpClient,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public translate: TranslateService,
    public platform: Platform,
    // private camera: Camera,
    public navCtrl: NavController,
    public alert: AlertProvider,
    public transfer: FileTransfer,
    public actionSheetCtrl: ActionSheetController,
    public loading: LoadingProvider) {
    this.consumerKeyEncript = Md5.hashStr(this.config.consumerKey);
    this.consumerSecretEncript = Md5.hashStr(this.config.consumerSecret);
  }

  //============================================================================================  
  //function updating user information
  updateInfo() {
    this.myAccountData.customers_id = this.shared.customerData.customers_id;

    if (this.profilePicture == this.config.imgUrl + this.shared.customerData.customers_picture) { //console.log("old picture");
      // this.myAccountData.customers_picture=$rootScope.customerData.customers_picture;
      this.myAccountData.customers_old_picture = this.shared.customerData.customers_picture;
    }
    else if (this.profilePicture == '')
      this.myAccountData.customers_picture = null;
    else
      this.myAccountData.customers_picture = this.profilePicture;

    var dat = this.myAccountData;
    //  console.log("post data  "+JSON.stringify(data));
    this.httpClient.post(this.config.url + 'updatecustomerinfo', dat).subscribe((data: any) => {

      this.loading.hide();
      if (data.success == 1) {
        //   document.getElementById("updateForm").reset();
        let d = data.data[0];
        this.shared.toast(data.message);
        // if (this.myAccountData.password != '')
        //   this.shared.customerData.password = this.myAccountData.password;
        console.log("data from server");
        console.log(d);
        this.shared.login(d);

        this.myAccountData.currentPassword = "";
        this.myAccountData.password = "";
      }
      else {
        this.translate.get(data.message).subscribe((res) => {
          this.shared.toast(res);
        });
      }
    }
      , error => {
        this.loading.hide();
        this.shared.toast("Error while Updating!");
      });
    //}
  }
//  openActionSheet() {
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
 // }

  // openCamera(type) {
  //   this.loading.autoHide(1000);

  //   let source = this.camera.PictureSourceType.CAMERA;
  //   if (type == 'gallery')
  //     source = this.camera.PictureSourceType.PHOTOLIBRARY;

  //   const options: CameraOptions = {
  //     quality: 50,
  //     sourceType: source,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     allowEdit: true,
  //     targetWidth: 100,
  //     targetHeight: 100,
  //     saveToPhotoAlbum: false,
  //     correctOrientation: true
  //   }

  //   this.platform.ready().then(() => {
  //     this.camera.getPicture(options).then((imageData) => {
  //       this.profilePicture = imageData;
  //     }, (err) => {

  //     });
  //   });
  // }
  uploadImage() {
    this.loading.show();
    if (this.myAccountData.customers_old_picture == this.profilePicture) {
      this.updateInfo();
      return;
    }
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
    fileTransfer.upload(this.profilePicture, this.config.url + 'uploadimage', options)
      .then((data) => {
        //console.log(data); //{"success":"1","data":[{"id":185,"image_id":95,"image_type":"ACTUAL","height":64,"width":64,"path":"images\/media\/2019\/08\/jWCC801512.png","created_at":null,"updated_at":null}],"message":"image is uploaded successfully."}
        let result = JSON.parse(data.response);
        if (result.success == 1) {
          this.myAccountData.image_id = result.data[0].image_id;
          this.updateInfo();
        }
        if (result.success == 0) {
          this.updateInfo();
          this.shared.toast("error= " + result.message);
        }
      }, (err) => {
        this.updateInfo();
        console.log(err);
      });
  }
  removeImage() {
    this.profilePicture = this.placeholder;
    this.myAccountData.image_id = 0;
  }
  //============================================================================================

  ionViewWillEnter() {
    this.myAccountData.customers_firstname = this.shared.customerData.customers_firstname;
    this.myAccountData.customers_lastname = this.shared.customerData.customers_lastname;

    this.myAccountData.customers_old_picture = this.profilePicture = this.config.imgUrl + this.shared.customerData.avatar;
    this.myAccountData.image_id = this.shared.customerData.image_id;
    this.myAccountData.phone = this.shared.customerData.phone;
    //this.myAccountData.password = this.shared.customerData.password;
    try {
      // console.log(this.shared.customerData.customers_dob);
      this.myAccountData.customers_dob = new Date(this.shared.customerData.customers_dob).toISOString();
      // console.log(this.myAccountData.customers_dob);
    } catch (error) {
      this.myAccountData.customers_dob = new Date("1-1-2000").toISOString();
    }

  }
  openCart() {
    this.navCtrl.push(CartPage);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
}
