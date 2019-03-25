import { Injectable } from '@angular/core';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import {ExportToCsv} from 'export-to-csv';

class exportableSales {
  date;
  skuname;
  skunumber;
  revenue;
  avgrevenuepercase;
  constructor(dataIn) {
    this.date = dataIn.year;
    this.skuname = dataIn.sku.skuname;
    this.skunumber = dataIn.sku.skunumber;
    this.revenue = dataIn.totalrevenue;
    this.avgrevenuepercase = dataIn.averagerevenuepercase;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SalesReportCalcService {

  constructor(public restv2: RestServiceV2) { }

  summarizeSales(allSales: any[], sku: any): any[] {
    var currentDate: Date = new Date();
    var currentYear: Number = currentDate.getFullYear();

    var salesByYear = {};
    for (let sale of allSales) {
      var dateOfSale: Date = new Date(sale['date']);
      var yearOfSale = dateOfSale.getFullYear();
      if (!salesByYear[yearOfSale]){
        salesByYear[yearOfSale] = [];
      }
      salesByYear[yearOfSale].push(sale);
    }
    var summarized = [];
    for (let year of Object.keys(salesByYear)) {
      summarized.push(this.summarizeYear(year, salesByYear[year], sku));
    }
    summarized = summarized.filter((value,index,array) => {
      return Number(value['year']) >= Number(currentYear) - 10;
    });
    return summarized;
  }

  private summarizeYear(year: string, allSalesInYear: any[], sku: any) {
    var summary = {};
    summary['year'] = year;
    summary['sku'] = sku;
    var totalRevenue = 0;
    var totalNumCases = 0;
    for (let sale of allSalesInYear) {
      totalRevenue += sale['numcases'] * sale['pricepercase'];
      totalNumCases += sale['numcases'];
    }
    summary['totalrevenue'] = totalRevenue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    summary['averagerevenuepercase'] = (totalRevenue/totalNumCases);
    return summary;
  }

  async exportSKU(sku, selectedCustomerId) {
    var allSales = await this.restv2.getSales(AndVsOr.AND, sku['_id'], selectedCustomerId=="all"?null:selectedCustomerId, new Date(new Date().getFullYear()-10, 0), null, 54321);
    var sales = this.summarizeSales(allSales, sku);

    var exportData = [];
    for (var sale of sales) {
      exportData.push(new exportableSales(sale));
    }
      const options = { 
        fieldSeparator: ',',
        filename: sku['skuname'] + " sales",
        quoteStrings: '',
        decimalSeparator: '.',
        showLabels: true, 
        showTitle: false,
        title: sku['skuname'],
        useTextFile: false,
        useBom: true,
        headers: ["Year","SKU Name","SKU Number", "Total Revenue", "Average Revenue Per Case"]
      };
      const csvExporter = new ExportToCsv(options);
      console.log(sku);
      console.log(exportData);
      csvExporter.generateCsv(exportData);
  }
}
