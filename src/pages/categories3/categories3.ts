// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { ProductsPage } from '../products/products';



@Component({
  selector: 'page-categories3',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('700ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: 'categories3.html',
})
export class Categories3Page {


  categories = [];
  parent: { [k: string]: any } = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    public events: Events,
  ) {

    this.parent.id = 0;
    this.parent.name = "Categories";

    if (navParams.get("parent") != undefined)
      this.parent = navParams.get("parent");

    for (let value of this.shared.allCategories) {
      if (value.parent_id == this.parent.id) { this.categories.push(value); }
    }
  }
  openSubCategories(parent) {
    let count = 0;
    for (let value of this.shared.allCategories) {
      if (parent.id == value.parent_id) count++;
    }
    if (count != 0)
      this.navCtrl.push(Categories3Page, { 'parent': parent });
    else
      this.navCtrl.push(ProductsPage, { id: parent.id, name: parent.name, sortOrder: 'newest' });
  }
  viewAll() {
    this.navCtrl.push(ProductsPage, { id: this.parent.id, name: this.parent.name, sortOrder: 'newest' });
  }
  openCart() {
    this.navCtrl.push(CartPage);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
  ionViewWillEnter() {
    if (this.config.admob == 1) this.shared.showAd();
  }
  ionViewDidEnter() {
    this.events.publish('footerChange', 'CategoriesPage');
  }
}

