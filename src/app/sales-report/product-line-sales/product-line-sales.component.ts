import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  productLine: any;
  skus: any[] = [];
  selectedCustomerId: any = "all";

  constructor() { }

  ngOnInit() {

  }

  async refreshData() {
    this.productLine = this._value['productLine'];
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
