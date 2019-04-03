import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ProductLineSalesCalcService } from './product-line-sales-calc.service';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProductLineSalesComponent),
  multi: true
};

@Component({
  selector: 'app-product-line-sales',
  templateUrl: './product-line-sales.component.html',
  styleUrls: ['./product-line-sales.component.css'],
  providers: [customValueProvider]
})
export class ProductLineSalesComponent implements OnInit, ControlValueAccessor {

  currentYear = new Date().getFullYear();
  tableData = [
    // {
    //   year2010: 10000000,
    //   year2011: 20000000,
    //   year2012: 30000000,
    //   year2013: 40000000,
    //   year2014: 50000000,
    //   year2015: 60000000,
    //   year2016: 70000000,
    //   year2017: 80000000,
    //   year2018: 90000000,
    //   year2019: 100000000,
    //   total: 200000000
    // }
  ]
  productLine: any;
  skus: any[] = [];
  selectedCustomerId: any = "all";
  totalRevenue = "loading...";

  constructor(public calc: ProductLineSalesCalcService) { }

  ngOnInit() {

  }

  modelChanged(event) {
    if (event && event['selectedIndex'] == 1) {
      this._value['selectedIndex'] = 1;
      this._value['selectedSKU'] = event['selectedSKU'];
      this.propagateChange(this._value);
    }
  }

  async refreshData() {
    this.productLine = this._value['productLine'];
    var thisobject = this;
    this.tableData = [await this.calc.totalRevenue(this.productLine)];
    console.log(this.tableData);
    this.skus = this.productLine['skus'];
    this.selectedCustomerId = this._value['selectedCustomerId'];
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
