import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesReportCalcService {

  constructor() { }

  async summarizeSales(allSales: any[]): Promise<any> {
    var currentDate: Date = new Date();
    var currentYear: Number = currentDate.getFullYear();
    console.log(currentYear);

    var salesByYear = {};
    for (let sale of allSales) {
      var dateOfSale: Date = new Date(sale['date']);
      var yearOfSale = dateOfSale.getFullYear();
      console.log("Date of Sale: ", dateOfSale);
      if (!salesByYear[yearOfSale]){
        salesByYear[yearOfSale] = [];
      }
      salesByYear[yearOfSale].push(sale);
    }
    console.log("Sales by year: ", salesByYear);
    var summarized = [];

    return summarized;
  }
}
