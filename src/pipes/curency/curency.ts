// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/

import { Pipe, PipeTransform } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';


@Pipe({
  name: 'curency',
})
export class CurencyPipe implements PipeTransform {

  constructor(public c: ConfigProvider) {
  }

  transform(value) {

    let currency = localStorage.currency;
    let decimals = localStorage.decimals;
    let currecnyPos=localStorage.currencyPos;

    var priceFixed = parseFloat(value).toFixed(decimals);

    if (priceFixed.toString() == 'NaN') {

      if (currecnyPos == 'left')
        return currency + "" + value;
      else
        return value + " " + currency;
    }
    else {
      if (currecnyPos == 'left')
        return currency + "" + priceFixed;
      else
        return priceFixed + "" + currency;
    }
  }
}
