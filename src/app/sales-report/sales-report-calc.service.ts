import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesReportCalcService {

  constructor() { }

  async summarizeSales(allSales: any[]): Promise<any> {
    return allSales;
  }
}
