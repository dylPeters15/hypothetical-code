import { Component, OnInit } from '@angular/core';
import { RestServiceV2, AndVsOr } from '../restv2.service';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit {

  productLines: any[] = [];
  allProductLinesSelected: boolean = false;

  customers: any[] = [];
  allCustomersSelected: boolean = false;

  constructor(public restv2: RestServiceV2) { }

  ngOnInit() {
    this.onInit();
  }

  async onInit(): Promise<any> {
    this.productLines = await this.restv2.getProductLines(AndVsOr.OR, null, null, 10000);
    for (let productLine of this.productLines) {
      productLine['checked'] = false;
    }
    console.log(this.productLines);
  }

  productLineSelectionsChanged(event, productLineName): void {
    var areAllSelected = true;
    for (let productLine of this.productLines) {
      if (productLineName == productLine['productlinename']) {
        if (!event) {
          areAllSelected = false;
        }
      } else {
        if (!productLine['checked']) {
          areAllSelected = false;
        }
      }
    }
    this.allProductLinesSelected = areAllSelected;
  }

  selectDeselectAllProductLines(): void {
    for (let productLine of this.productLines) {
      productLine['checked'] = !this.allProductLinesSelected;
    }
  }

  customerSelectionsChanged(event, customerName): void {
    var areAllSelected = true;
    for (let customer of this.customers) {
      if (customerName == customer['customername']) {
        if (!event) {
          areAllSelected = false;
        }
      } else {
        if (!customer['checked']) {
          areAllSelected = false;
        }
      }
    }
    this.allCustomersSelected = areAllSelected;
  }

  selectDeselectAllCustomers(): void {
    for (let customer of this.customers) {
      customer['checked'] = !this.allCustomersSelected;
    }
  }

}
