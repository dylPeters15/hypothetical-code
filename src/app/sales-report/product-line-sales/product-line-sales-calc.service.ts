import { Injectable } from '@angular/core';
import { RestServiceV2, AndVsOr } from '../../restv2.service' 

@Injectable({
  providedIn: 'root'
})
export class ProductLineSalesCalcService {

  constructor(public restv2: RestServiceV2) { }

  async totalRevenue(productLine: any): Promise<any> {
    var toReturn = {};
    var totalRevenue = 0;
    var allSales = [];
    for (var i = 0; i < productLine.skus.length; i++) {
      var sku = productLine.skus[i].sku;
      var sales = await this.restv2.getSales(AndVsOr.AND, sku._id, null, new Date(new Date().getFullYear() - 9, 0), null, 10000);
      allSales = allSales.concat(sales);
      for (let sale of sales) {
        totalRevenue += sale.numcases * sale.pricepercase;
      }
    }
    toReturn['total'] = "$" + totalRevenue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    var currentYear = new Date().getFullYear();

    for (var i = currentYear - 9; i <= currentYear; i++) {
      toReturn['year' + (i)] = "$" + this.summarizeYear(allSales, i).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    console.log(toReturn)
    return toReturn;
  }

  summarizeYear(allSales, year) {
    var revenue = 0;
    for (let sale of allSales) {
      if (new Date(sale.date).getFullYear() == year) {
        revenue += sale.numcases * sale.pricepercase;
      }
    }
    return revenue;
  }
}
