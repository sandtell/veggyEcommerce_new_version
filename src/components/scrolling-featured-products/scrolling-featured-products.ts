import { Component, ViewChild } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the ScrollingFeaturedProductsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'scrolling-featured-products',
  templateUrl: 'scrolling-featured-products.html'
})
export class ScrollingFeaturedProductsComponent {

  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;
  products: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  page = 0;
  count = 0;
  loadingServerData = false;

  constructor(
    public http: Http,
    public httpClient: HttpClient,
    public config: ConfigProvider,
    public shared: SharedDataProvider, ) {
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
    data.type = 'special';

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
