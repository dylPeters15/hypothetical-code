import { Component, Input, forwardRef, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RestServiceV2, AndVsOr } from '../../restv2.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SalesReportCalcService } from '../sales-report-calc.service';

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

  sales: any[] = [];
  salesTableData: any = new MatTableDataSource(this.sales);
  allReplacement = 54321;
  displayedColumns: string[] = ['date'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public restv2: RestServiceV2, public calc: SalesReportCalcService) { }

  ngOnInit() {

  }

  async refreshData() {
    console.log("Refresh data: ", this._value);
    this.sales = await this.restv2.getSales(AndVsOr.AND, this._value['_id'], null, null, null, this.allReplacement);
    console.log("sales: ",this.sales);
    console.log("Selected customers: ", this._value['selectedCustomers']);
    this.sales = this.sales.filter((value, index, array) => {
      for (let customer of this._value['selectedCustomers']) {
        if (customer['customername'] == value['customer']['customername']) {
          return true;
        }
      }
      return false;
    });
    this.sales = await this.calc.summarizeSales(this.sales);
    this.salesTableData = new MatTableDataSource(this.sales);
    this.salesTableData.paginator = this.paginator;
  }

  getPageSizeOptions() {
    return [5, 20, 50, 100, this.allReplacement];
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
