import { Injectable } from '@angular/core';
var moment = require('moment');

@Injectable({
  providedIn: 'root'
})
export class SkuDrilldownCalcService {

  constructor() { }

  formatSalesForTable(allSales: any[]): any[] {
    var salesByYearAndWeek = this.salesByYearAndWeek(allSales);
    console.log(salesByYearAndWeek);
    var toReturn = [];
    for (let year of Object.keys(salesByYearAndWeek)) {
      for (let week of Object.keys(salesByYearAndWeek[year])) {
        for (let sale of salesByYearAndWeek[year][week]) {
          var objectToPush = {};
          objectToPush['year'] = year;
          objectToPush['weeknumber'] = week;
          console.log("sale: ",sale);
          objectToPush['customername'] = sale['customer']['customername'];
          objectToPush['customernumber'] = sale['customer']['customernumber'];
          toReturn.push(objectToPush);
        }
      }
    }
    return toReturn;
  }

  salesByYearAndWeek(allSales: any[]): any {
    var toReturn = {};
    for (var sale of allSales) {
      var dateOfSale: Date = new Date(sale['date']);
      var yearOfSale = dateOfSale.getUTCFullYear()+"";
      var weekOfSale = moment(dateOfSale).isoWeek()+"";
      if (!toReturn[yearOfSale]) {
        toReturn[yearOfSale] = {};
      }
      if (!toReturn[yearOfSale][weekOfSale]) {
        toReturn[yearOfSale][weekOfSale] = [];
      }
      toReturn[yearOfSale][weekOfSale].push(sale);
    }
    return toReturn;
  }
}
