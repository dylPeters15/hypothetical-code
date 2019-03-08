import { Component, OnInit } from '@angular/core';
import { RestServiceV2, AndVsOr } from '../restv2.service';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit {

  productLines: any[] = [];
  allProductLinesSelected: boolean = true;
  selectedProductLines: any[] = [];
  allReplacement = 54321;

  customers: any[] = [];
  allCustomersSelected: boolean = true;
  selectedCustomers: any[] = [];

  constructor(public restv2: RestServiceV2) { }

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
    this.refreshSelected();
  }

  refreshSelected(): void {
    this.selectedCustomers = this.customers.filter((value, index, array) => {
      return value['checked'];
    });

    this.selectedProductLines = this.productLines.filter((value, index, array) => {
      return value['checked'];
    });

    for (let productLine of this.selectedProductLines) {
      productLine['selectedCustomers'] = this.selectedCustomers;
    }
  }

  productLineSelectionsChanged(): void {
    var areAllSelected = true;
    for (let productLine of this.productLines) {
      if (!productLine['checked']) {
        areAllSelected = false;
      }
    }
    this.allProductLinesSelected = areAllSelected;
    this.refreshSelected();
  }

  selectDeselectAllProductLines(): void {
    for (let productLine of this.productLines) {
      productLine['checked'] = this.allProductLinesSelected;
    }
    this.refreshSelected();
  }

  customerSelectionsChanged(): void {
    var areAllSelected = true;
    for (let customer of this.customers) {
      if (!customer['checked']) {
        areAllSelected = false;
      }
    }
    this.allCustomersSelected = areAllSelected;
    this.refreshSelected();
  }

  selectDeselectAllCustomers(): void {
    for (let customer of this.customers) {
      customer['checked'] = this.allCustomersSelected;
    }
    this.refreshSelected();
  }

}
