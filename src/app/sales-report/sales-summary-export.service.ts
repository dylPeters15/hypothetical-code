import { Injectable } from '@angular/core';
import { SalesReportCalcService } from './sales-report-calc.service';
import { RestServiceV2 } from '../restv2.service';

@Injectable({
  providedIn: 'root'
})
export class SalesSummaryExportService {

  constructor(public calc: SalesReportCalcService, public restv2: RestServiceV2) { }

  public exportSalesSummary(selectedProductLines, selectedCustomerId): void {
    console.log(selectedProductLines);
    console.log(selectedCustomerId);
    for (let productLine of selectedProductLines) {
      for (let sku of productLine['skus']) {
        this.calc.exportSKU(sku.sku, selectedCustomerId=="all"?null:selectedCustomerId);
      }
    }
  }
}
