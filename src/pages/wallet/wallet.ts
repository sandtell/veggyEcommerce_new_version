import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoadingProvider } from '../../providers/loading/loading';
import { Md5 } from 'ts-md5';
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  consumerKeyEncript: any;
  consumerSecretEncript: any;
  walletJson:any = [];
  walletBalances;
  public customerID;
  public noRecord:boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private shared: SharedDataProvider,
    private config: ConfigProvider,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    public loading: LoadingProvider,
    public md5: Md5,
  ) {
    this.consumerKeyEncript = Md5.hashStr(this.config.consumerKey);
    this.consumerSecretEncript = Md5.hashStr(this.config.consumerSecret);

    if (this.shared.customerData.customers_id != null) {
      this.customerID =  this.shared.customerData.customers_id;
     }

    
  }

  ionViewDidLoad() {
    // this.getWalletData(12);
    this.getWalletData(this.customerID);
  }  

  doRefresh(refresher) {
    setTimeout(() => {      
      this.getWalletData(this.customerID);      
      refresher.complete();
    }, 2000);
  }
  

  getWalletData(customerID) {
    let data: Observable<any>;
    let url = this.config.url + "balances";

    let d = new Date();
    const headers = new HttpHeaders().set('consumer-device-id', 'device id of the app').set('consumer-nonce', d.getTime().toString()).set('consumer-secret', this.consumerSecretEncript).set('consumer-key', this.consumerKeyEncript).set('consumer-ip','157.50.247.104').set('Content-Type','application/json');
    let queryParams = { customer_id: customerID };

    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    data = this.http.post(url, queryParams,{ headers: headers });
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.walletBalances = result.data.balances;

        if(result.data.history.length!=0){
          this.noRecord = true;
          this.walletJson = result.data;
        }else {
          this.noRecord = false;
        }

        
        
        loader.dismiss();
      }, error => {
        console.log(error);
        loader.dismiss();
      });
    });
  }




}
