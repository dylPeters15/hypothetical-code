import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesReportCalcService {

  constructor() { }

  summarizeSales(allSales: any[], sku: any): any[] {
    var currentDate: Date = new Date();
    var currentYear: Number = currentDate.getFullYear();
    console.log(currentYear);

    var salesByYear = {};
    for (let sale of allSales) {
      var dateOfSale: Date = new Date(sale['date']);
      var yearOfSale = dateOfSale.getFullYear();
      // console.log("Date of Sale: ", dateOfSale);
      if (!salesByYear[yearOfSale]){
        salesByYear[yearOfSale] = [];
      }
      salesByYear[yearOfSale].push(sale);
    }
    console.log("Sales by year: ", salesByYear);
    var summarized = [];
    for (let year of Object.keys(salesByYear)) {
      summarized.push(this.summarizeYear(year, salesByYear[year], sku));
    }
    summarized = summarized.filter((value,index,array) => {
      return Number(value['year']) >= Number(currentYear) - 10;
    });
    return summarized;
  }

  summarizeYear(year: string, allSalesInYear: any[], sku: any) {
    var summary = {};
    summary['year'] = year;
    summary['sku'] = sku;
    var totalRevenue = 0;
    var totalNumCases = 0;
    for (let sale of allSalesInYear) {
      totalRevenue += sale['numcases'] * sale['pricepercase'];
      totalNumCases += sale['numcases'];
    }
    summary['totalrevenue'] = totalRevenue;
    summary['averagerevenuepercase'] = (totalRevenue/totalNumCases);
    return summary;
  }
}
