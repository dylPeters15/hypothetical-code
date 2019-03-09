import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-sku-drilldown',
  templateUrl: './sku-drilldown.component.html',
  styleUrls: ['./sku-drilldown.component.css']
})
export class SkuDrilldownComponent implements OnInit {

  sku: any = {};
  selectedCustomers: any[] = [];

  constructor(private dialogRef: MatDialogRef<SkuDrilldownComponent>, @Inject(MAT_DIALOG_DATA) public initData: any) { }

  ngOnInit() {
    console.log(this.initData);
    if (this.initData['sku']) {
      this.sku = this.initData['sku'];
    }
    if (this.initData['selectedCustomers']) {
      this.selectedCustomers = this.initData['selectedCustomers'];
    }
  }

}
