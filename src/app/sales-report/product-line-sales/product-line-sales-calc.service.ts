import { Injectable } from '@angular/core';
import { RestServiceV2, AndVsOr } from '../../restv2.service' 

@Injectable({
  providedIn: 'root'
})
export class ProductLineSalesCalcService {

  constructor(public restv2: RestServiceV2) { }

  async totalRevenue(productLine: any) {
    var totalRevenue = 0;
    for (var i = 0; i < productLine.skus.length; i++) {
      var sku = productLine.skus[i].sku;
      var sales = await this.restv2.getSales(AndVsOr.AND, sku._id, null, new Date(new Date().getFullYear() - 9, 0), null, 10000);
      for (let sale of sales) {
        totalRevenue += sale.numcases * sale.pricepercase;
      }
    }
    return totalRevenue;
  }
}
