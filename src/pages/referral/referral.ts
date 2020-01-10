import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ConfigProvider } from '../../providers/config/config';

@Component({
  selector: 'page-referral',
  templateUrl: 'referral.html',
})
export class ReferralPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shared : SharedDataProvider,
    public socialSharing: SocialSharing,
    private config : ConfigProvider
    ) {
      
  }

  ionViewDidLoad() { 
    console.log(this.shared.customerData.referral_code);
  }

  shareFn() {
    let referralCode = this.shared.customerData.referral_code;
    let shareLink = this.config.url + 'goappstore/' + referralCode;
    let title = 'Invite and Earn';
    this.socialSharing.share(title, null, null, shareLink).then(() => {
      console.log('success');
    }).catch((error) => {
      console.log(error);
      console.log('error');
    });
  }

}
