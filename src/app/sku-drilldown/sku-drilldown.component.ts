import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RestServiceV2, AndVsOr } from '../restv2.service';

@Component({
  selector: 'app-sku-drilldown',
  templateUrl: './sku-drilldown.component.html',
  styleUrls: ['./sku-drilldown.component.css']
})
export class SkuDrilldownComponent implements OnInit {

  sku: any = {};
  prevStartDate = new Date();
  startDate = new Date();
  prevEndDate = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear()+1));
  endDate = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear()+1));

  customers: any[] = [];
  allCustomersSelected: boolean = true;
  selectedCustomers: any[] = [];

  constructor(public restv2: RestServiceV2, private dialogRef: MatDialogRef<SkuDrilldownComponent>, @Inject(MAT_DIALOG_DATA) public initData: any) { }

  ngOnInit() {
    if (this.initData['sku']) {
      this.sku = this.initData['sku'];
    }
    this.onInit().then(() => {
      console.log(this.initData);
      for(var i = 0; i < this.customers.length && this.initData && this.initData['selectedCustomers']; i++) {
        this.customers[i]['checked'] = this.initData['selectedCustomers'].filter((value,index,array) => {
          return value['customername'] == this.customers[i]['customername'];
        }).length == 1;
      }
      this.refreshSelected();
    });
  }

  async onInit(): Promise<void> {
    this.customers = await this.restv2.getCustomers(AndVsOr.OR, null, null, null, 10000);
    for (let customer of this.customers) {
      customer['checked'] = true;
    }
    this.refreshSelected();
  }

  refreshSelected(): void {
    var areAllSelected = true;
    for (let customer of this.customers) {
      if (!customer['checked']) {
        areAllSelected = false;
      }
    }
    this.allCustomersSelected = areAllSelected;
    this.selectedCustomers = this.customers.filter((value, index, array) => {
      return value['checked'];
    });
  }

  customerSelectionsChanged(): void {
    this.refreshSelected();
  }

  selectDeselectAllCustomers(): void {
    for (let customer of this.customers) {
      customer['checked'] = this.allCustomersSelected;
    }
    this.refreshSelected();
  }

  selectionChange() {
    if (this.startDate < this.endDate) {
      console.log("valid");
      this.prevStartDate = this.startDate;
      this.prevEndDate = this.endDate;
    } else {
      console.log("invalid");
      this.startDate = this.prevStartDate;
      this.endDate = this.prevEndDate;
    }
    console.log("prevStartDate", this.prevStartDate);
    console.log("startDate", this.startDate);
    console.log("prevEndDate", this.prevEndDate);
    console.log("endDate", this.endDate);
  }

}
