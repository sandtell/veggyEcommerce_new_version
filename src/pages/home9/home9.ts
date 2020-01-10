import { Component, ViewChild } from '@angular/core';
import { NavController, Events, Content } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the Home9Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home9',
  templateUrl: 'home9.html',
})
export class Home9Page {
  @ViewChild(Content) content: Content;
  segments: any = 'topSeller';
  constructor(public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    public events: Events,
    translate: TranslateService) {
  }
  scrollTopButton = false;
  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }
  openCategoryPage() {
    this.events.publish("openCategoryPage");
  }
  onScroll(e) {

    if (e.scrollTop >= 1200) this.scrollTopButton = true;
    if (e.scrollTop < 1200) this.scrollTopButton = false;
    //else this.scrollTopButton=false;
    //   console.log(e);
  }
  ionViewDidEnter() {
    this.events.publish('footerChange', 'HomePage');
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

}
