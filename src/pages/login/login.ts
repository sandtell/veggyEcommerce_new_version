// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AlertProvider } from '../../providers/alert/alert';
import { GooglePlus } from '@ionic-native/google-plus';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',

})
export class LoginPage {
  formData = { email: '', password: '' };
  errorMessage = '';
  constructor(
    public httpClient: HttpClient,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    private fb: Facebook,
    public alert: AlertProvider,
    private googlePlus: GooglePlus
  ) {
    this.shared.currentOpenedModel = this;
  }

  login() {
    this.loading.show();
    this.errorMessage = '';
    this.httpClient.post(this.config.url + 'processlogin', this.formData).subscribe((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.shared.login(data.data[0]);
        this.dismiss();
      }
      if (data.success == 0) {
        this.errorMessage = data.message;
      }
    });
  }
  openSignUpPage() {
    let modal = this.modalCtrl.create(SignUpPage);
    modal.present();
    this.dismiss();
  }
  openForgetPasswordPage() {
    let modal = this.modalCtrl.create(ForgotPasswordPage);
    modal.present();
  }

  facebookLogin() {
    this.fb.getLoginStatus().then((res: any) => {
      if (res.status == 'connected') {
        console.log("user connected already" + res.authResponse.accessToken);
        this.createAccount(res.authResponse.accessToken, 'fb');

      }
      else {
        console.log("USer Not login ");
        this.fb.login(['public_profile', 'email'])
          .then((res: FacebookLoginResponse) => {
            // this.alert.show('Logged into Facebook!' + JSON.stringify(res));
            console.log("successfully login ");
            this.createAccount(res.authResponse.accessToken, 'fb');
          })
          .catch(e => this.alert.show('Error logging into Facebook' + JSON.stringify(e)));
      }
    }).catch(e => this.alert.show('Error Check Login Status Facebook' + JSON.stringify(e)));
  }

  googleLogin() {
    this.loading.autoHide(500);
    this.googlePlus.login({})
      .then(res => {
        //  alert(JSON.stringify(res))
        this.createAccount(res, 'google');
      })
      .catch(err => this.alert.show(JSON.stringify(err)));
  }
  //============================================================================================  
  //creating new account using function facebook or google details 
  createAccount(info, type) {
    // alert(info);
    this.loading.show();
    var dat: { [k: string]: any } = {};
    var url = '';
    if (type == 'fb') {
      url = 'facebookregistration';
      dat.access_token = info;
    }
    else {
      url = 'googleregistration';
      dat = info;
    }
    this.httpClient.post(this.config.url + url, dat).subscribe((data: any) => {
      this.loading.hide();
      // alert("data get");
      if (data.success == 1) {
        this.shared.login(data.data[0]);
        //alert('login');
        this.alert.showWithTitle("<h3>Your Account has been created successfully !</h3><ul><li>Your Email: "
          + "<span>" + this.shared.customerData.email + "</span>" + "</li><li>Your Password: "
          + "<span>" + this.shared.customerData.password + "</span>" +
          " </li></ul><p>You can login using this Email and Password.<br>You can change your password in Menu -> My Account</p>", "Account Information");
        //  $ionicSideMenuDelegate.toggleLeft();
        this.dismiss();

      }
      else if (data.success == 2) {
        //  alert("login with alreday");
        this.dismiss();
        this.shared.login(data.data[0]);
      }

    }, error => {
      this.loading.hide();
      this.alert.show("error " + JSON.stringify(error));
      // console.log("error " + JSON.stringify(error));
    });
  };
  //close modal
  dismiss() {
    this.viewCtrl.dismiss();
    this.shared.currentOpenedModel = null;
  }

}
