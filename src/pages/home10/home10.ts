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
 * Generated class for the Home10Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home10',
  templateUrl: 'home10.html',
})
export class Home10Page {
  @ViewChild(Content) content: Content;

  segments: any = 'sale';
  constructor(
    public http: Http,
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

  onScroll(e) {

    if (e.scrollTop >= 1200) this.scrollTopButton = true;
    if (e.scrollTop < 1200) this.scrollTopButton = false;
    //else this.scrollTopButton=false;
    //   console.log(e);
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
  openCategoryPage() {
    this.events.publish("openCategoryPage");
  }

}
