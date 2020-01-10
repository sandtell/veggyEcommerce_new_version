import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the Home8Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home8',
  templateUrl: 'home8.html',
})
export class Home8Page {

  constructor(public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    public events: Events,
    translate: TranslateService) {
  }

  openProducts(value) {
    this.navCtrl.push(ProductsPage, { sortOrder: value });
  }
  openCart() {
    this.navCtrl.push(CartPage);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
  ionViewDidEnter() {
    this.events.publish('footerChange', 'HomePage');
  }
}
