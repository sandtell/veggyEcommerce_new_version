import { Component, ViewChild } from '@angular/core';
import { NavController, Events, Content, InfiniteScroll } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the Home7Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home7',
  templateUrl: 'home7.html',
})
export class Home7Page {
  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;
  products: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  page = 0;
  count = 0;
  loadingServerData = false;

  segments: any = 'topSeller';

  segments2 = "aboutUs";
  constructor(public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    public events: Events,
    public httpClient: HttpClient,
    public translate: TranslateService) {
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
  getProducts(infiniteScroll) {

    if (this.loadingServerData) return 0;
    if (this.page == 0) {
      this.count++;
      this.loadingServerData = false;
    }
    this.loadingServerData = true;

    let data: { [k: string]: any } = {};
    if (this.shared.customerData.customers_id != null)
      data.customers_id = this.shared.customerData.customers_id;
    data.page_number = this.page;
    data.language_id = this.config.langId;
    data.currency_code = this.config.currecnyCode;

    this.httpClient.post(this.config.url + 'getallproducts', data).subscribe((data: any) => {
      let dat = data.product_data;
      this.infinite.complete();
      if (this.page == 0) {
        this.products = new Array;
      }
      if (dat.length != 0) {
        this.page++;
        for (let value of dat) {
          this.products.push(value);
        }
      }
      if (dat.length == 0) { this.infinite.enable(false); }
      this.loadingServerData = false;

    });
  }

  ngOnInit() {
    this.getProducts(null);
  }
}
