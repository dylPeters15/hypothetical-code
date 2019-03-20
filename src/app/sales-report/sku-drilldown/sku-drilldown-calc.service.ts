import { Injectable } from '@angular/core';
import { RestServiceV2, AndVsOr } from 'src/app/restv2.service';
var moment = require('moment');
import { ExportToCsv } from 'export-to-csv';

@Injectable({
  providedIn: 'root'
})
export class SkuDrilldownCalcService {

  constructor(public restv2: RestServiceV2) { }

  formatSalesForTable(allSales: any[]): any[] {
    var salesByYearAndWeek = this.salesByYearAndWeek(allSales);
    return this.convertYearAndWeekSalesToArray(salesByYearAndWeek);
  }

  convertYearAndWeekSalesToArray(salesByYearAndWeek): any[] {
    var toReturn = [];
    for (let year of Object.keys(salesByYearAndWeek)) {
      for (let week of Object.keys(salesByYearAndWeek[year])) {
        toReturn.push(salesByYearAndWeek[year][week]);
        toReturn[toReturn.length-1]['year'] = year;
        toReturn[toReturn.length-1]['weeknumber'] = week;
        toReturn[toReturn.length-1]['date'] = moment(new Date(Number(year), 0)).isoWeek(Number(week)).format('MM/DD/YYYY');
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

  async exportSKUDrilldown(sku, selectedCustomerId) {
    var allSales = await this.restv2.getSales(AndVsOr.AND, sku['_id'], selectedCustomerId=="all"?null:selectedCustomerId, new Date(new Date().getFullYear()-10), null, 54321);
    var sales = this.formatSalesForTable(allSales);
      const options = { 
        fieldSeparator: ',',
        filename: sku['skuname'] + " sales drilldown",
        quoteStrings: '',
        decimalSeparator: '.',
        showLabels: true, 
        showTitle: false,
        title: sku['skuname'],
        useTextFile: false,
        useBom: true,
        // headers: ["Year",
          // "Week Number",
          // "Customer Number",
          // "Customer Name",
          // "Number of Sales",
          // "Average Price Per Case",
          // "Revenue"]
          useKeysAsHeaders: true
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(sales);
  }
}
