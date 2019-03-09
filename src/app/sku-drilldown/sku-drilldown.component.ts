import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from "@angular/material";
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { SkuDrilldownCalcService } from './sku-drilldown-calc.service';

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
  selectedCustomerId: string = "all";
  
  salesTableData: MatTableDataSource<any> = new MatTableDataSource();

  constructor(public restv2: RestServiceV2, private dialogRef: MatDialogRef<SkuDrilldownComponent>, @Inject(MAT_DIALOG_DATA) public initData: any, public calc: SkuDrilldownCalcService) { }

  ngOnInit() {
    if (this.initData['sku']) {
      this.sku = this.initData['sku'];
    }
    this.restv2.getCustomers(AndVsOr.OR, null, null, null, 10000).then(response => {
      this.customers = response;
      this.refreshData();
    });
  }

  async refreshData(): Promise<void> {
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
    var sales = await this.restv2.getSales(AndVsOr.AND, this.sku['_id'], this.selectedCustomerId=="all"?null:this.selectedCustomerId, this.startDate, this.endDate, 54321);
    this.salesTableData = new MatTableDataSource(this.calc.formatSalesForTable(sales));
  }

}
