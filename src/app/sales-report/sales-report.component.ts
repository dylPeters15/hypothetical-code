import { Component, OnInit } from '@angular/core';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { SalesSummaryExportService } from './sales-summary-export.service';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit {

  productLines: any[] = [];
  allProductLinesSelected: boolean = true;
  selectedProductLines: any[] = [];

  customers: any[] = [];
  selectedCustomerId: string = "all";
  selectedIndex: Number = 0;

  selectedSKU = {};

  constructor(public restv2: RestServiceV2, public exporter: SalesSummaryExportService) { }

  exportSummary() {
    this.exporter.exportSalesSummary();
  }

  modelChanged(event) {
    if(event && event['selectedIndex'] == 1) {
      this.selectedIndex = 1;
      this.selectedSKU = event['selectedSKU'];
    }
  }

  ngOnInit() {
    this.onInit();
  }
  async onInit(): Promise<any> {
    this.productLines = await this.restv2.getProductLines(AndVsOr.OR, null, null, 10000);
    for (let productLine of this.productLines) {
      productLine['checked'] = true;
    }
    this.customers = await this.restv2.getCustomers(AndVsOr.OR, null, null, null, 10000);
    for (let customer of this.customers) {
      customer['checked'] = true;
    }
    this.refreshData();
  }

  refreshData() {
    var areAllSelected = true;
    for (let productLine of this.productLines) {
      if (!productLine['checked']) {
        areAllSelected = false;
      }
    }
    this.allProductLinesSelected = areAllSelected;
    this.selectedProductLines = this.productLines.filter((value, index, array) => {
      return value['checked'];
    });
  }

  selectDeselectAllProductLines(): void {
    for (let productLine of this.productLines) {
      productLine['checked'] = this.allProductLinesSelected;
    }
    this.refreshData();
  }

}
