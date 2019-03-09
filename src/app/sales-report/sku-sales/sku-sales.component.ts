import { Component, Input, forwardRef, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RestServiceV2, AndVsOr } from '../../restv2.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SalesReportCalcService } from '../sales-report-calc.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { SkuDrilldownComponent } from '../../sku-drilldown/sku-drilldown.component';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkuSalesComponent),
  multi: true
};

@Component({
  selector: 'app-sku-sales',
  templateUrl: './sku-sales.component.html',
  styleUrls: ['./sku-sales.component.css'],
  providers: [customValueProvider]
})
export class SkuSalesComponent implements OnInit, ControlValueAccessor {

  sku: any = {};
  selectedCustomerId: any = "all";
  allSales: any[] = [];
  sales: any[] = [];
  salesTableData: any = new MatTableDataSource(this.sales);
  displayedColumns: string[] = ['year', 'sku', 'totalrevenue', 'averagerevenuepercase'];

  constructor(public restv2: RestServiceV2, public calc: SalesReportCalcService, private dialog: MatDialog) { }

  ngOnInit() {

  }

  async refreshData() {
    this.sku = this._value['sku'];
    this.selectedCustomerId = this._value['selectedCustomerId'];
    this.allSales = await this.restv2.getSales(AndVsOr.AND, this.sku['_id'], this.selectedCustomerId=="all"?null:this.selectedCustomerId, new Date(new Date().getFullYear()-10), null, 54321);
    this.sales = this.calc.summarizeSales(this.allSales, this.sku);
    this.salesTableData = new MatTableDataSource(this.sales);
  }

  displayDrilldown(): void {
    console.log("Display Drilldown");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '95%';
    dialogConfig.height = '95%';
    dialogConfig.data = {
      sku: this.sku,
      selectedCustomerId: this.selectedCustomerId
    }
    this.dialog.open(SkuDrilldownComponent, dialogConfig);
  }

  _value = '';
  stringified = '';
  keys = [];

  propagateChange: any = () => { };

  @Input() label: string;

  writeValue(value: any) {
    if (value) {
      this._value = value;
      this.stringified = JSON.stringify(value);
      this.keys = Object.keys(value);
      this.refreshData();
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void { }

  onChange(event) {
    this.stringified = JSON.stringify(event.target.value);
    this.keys = Object.keys(event.target.value);
    this.propagateChange(event.target.value);
  }

}
