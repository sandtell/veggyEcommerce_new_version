// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/

//import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http } from '@angular/http';


export function createTranslateLoader(http: Http) {

  //          ---------------------------------- Note ---------------------------------------
  // if your are using this version please do not paste the url below there is no need to add url here 

  return new TranslateHttpLoader(http, '', "");

}