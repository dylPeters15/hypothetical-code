import { Component, Input, forwardRef, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SalesSummaryRowCalcService } from './sales-summary-row-calc.service';
import { MatTableDataSource } from "@angular/material";

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SalesSummaryRowComponent),
  multi: true
};

@Component({
  selector: 'app-sales-summary-row',
  templateUrl: './sales-summary-row.component.html',
  styleUrls: ['./sales-summary-row.component.css'],
  providers: [customValueProvider]
})
export class SalesSummaryRowComponent implements OnInit, ControlValueAccessor {

  summaryTableData: MatTableDataSource<any> = new MatTableDataSource();

  constructor(public calc: SalesSummaryRowCalcService) { }

  ngOnInit() {
  }

  async refreshData() {
    var summary = await this.calc.summarizeTotal(this._value['allSales'], this._value['sku']);
    this.summaryTableData = new MatTableDataSource(summary);
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
      if (this._value['allSales'] && this._value['sku'] && Object.keys(this._value['sku']).length > 0) {
        this.refreshData();
      }
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
