import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { ConfigProvider } from '../../providers/config/config';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'page-currency-list',
  templateUrl: 'currency-list.html',
})
export class CurrencyListPage {
  currency: any;
  currencyList = [];
  currentCurrencySymbol = localStorage.currency;
  constructor(
    public loading: LoadingProvider,
    public viewCtrl: ViewController,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public httpClient: HttpClient,
    public translate: TranslateService) {
    this.getListOfCurrency();


  }
  getListOfCurrency() {
    this.loading.show();
    this.httpClient.get(this.config.url + 'getcurrencies').subscribe((data:any) => {
      this.loading.hide();
      this.currencyList = data.data;
      this.currencyList.forEach(val => {
        if (localStorage.currencyCode == val.code)
          this.currency = val;
      });
    });
  }
  updateCurrency() {
    if (localStorage.currencyCode != this.currency.code) {
      this.loading.autoHide(1000);

      localStorage.currencyCode = this.currency.code;
      if (this.currency.symbol_left != null) {
        localStorage.currencyPos = "left";
        localStorage.currency = this.currency.symbol_left;
      }
      else {
        localStorage.currencyPos = "right";
        localStorage.currency = this.currency.symbol_right;
      }

      localStorage.decimals = this.currency.decimal_places;
      this.shared.emptyCart();
      this.shared.emptyRecentViewed();
      // console.log(this.currency);
      // console.log(localStorage.currency);
     
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  //close modal
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
