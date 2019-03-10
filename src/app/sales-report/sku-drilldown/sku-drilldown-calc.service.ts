import { Injectable } from '@angular/core';
var moment = require('moment');

@Injectable({
  providedIn: 'root'
})
export class SkuDrilldownCalcService {

  constructor() { }

  formatSalesForTable(allSales: any[]): any[] {
    var salesByYearAndWeek = this.salesByYearAndWeek(allSales);
    return this.convertYearAndWeekSalesToArray(salesByYearAndWeek);
  }

  convertYearAndWeekSalesToArray(salesByYearAndWeek): any[] {
    console.log("Sales by year and week: ",salesByYearAndWeek);
    var toReturn = [];
    for (let year of Object.keys(salesByYearAndWeek)) {
      for (let week of Object.keys(salesByYearAndWeek[year])) {
        toReturn.push(salesByYearAndWeek[year][week]);
        toReturn[toReturn.length-1]['year'] = year;
        toReturn[toReturn.length-1]['weeknumber'] = week;
      }
    }
    return toReturn;
  }

  salesByYearAndWeek(allSales: any[]): any {
    var allSalesForYearAndWeek = {};
    for (var sale of allSales) {
      var dateOfSale: Date = new Date(sale['date']);
      var yearOfSale = dateOfSale.getUTCFullYear()+"";
      var weekOfSale = moment(dateOfSale).isoWeek()+"";
      if (!allSalesForYearAndWeek[yearOfSale]) {
        allSalesForYearAndWeek[yearOfSale] = {};
      }
      if (!allSalesForYearAndWeek[yearOfSale][weekOfSale]) {
        allSalesForYearAndWeek[yearOfSale][weekOfSale] = [];
      }
      allSalesForYearAndWeek[yearOfSale][weekOfSale].push(sale);
    }

    var summedSales = {};
    for (let year of Object.keys(allSalesForYearAndWeek)) {
      summedSales[year] = {};
      for (let week of Object.keys(allSalesForYearAndWeek[year])) {
        console.log("Length: ", allSalesForYearAndWeek[year][week].length);
        if (allSalesForYearAndWeek[year][week].length > 1) {
          console.log(allSalesForYearAndWeek[year][week]);
        }
        summedSales[year][week] = {};
        var customerNums = new Set();
        var customerNames = new Set();
        var totalRevenue = 0;
        var numCases = 0;
        for (let sale of allSalesForYearAndWeek[year][week]) {
          customerNums.add(sale['customer']['customernumber']);
          customerNames.add(sale['customer']['customername']);
          totalRevenue += sale['numcases']*sale['pricepercase'];
          numCases += sale['numcases'];
        }
        summedSales[year][week]['customername'] = Array.from(customerNames).join(", ");
        summedSales[year][week]['customernumber'] = Array.from(customerNums).join(", ");
        summedSales[year][week]['numsales'] = allSalesForYearAndWeek[year][week].length;
        summedSales[year][week]['pricepercase'] = numCases==0?0:(totalRevenue/numCases);
        summedSales[year][week]['revenue'] = totalRevenue;
      }
    }
    return summedSales;
  }
}
