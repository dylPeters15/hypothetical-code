import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkuGraphComponent),
  multi: true
};

@Component({
  selector: 'app-sku-graph',
  templateUrl: './sku-graph.component.html',
  styleUrls: ['./sku-graph.component.css'],
  providers: [customValueProvider]
})
export class SkuGraphComponent implements OnInit, ControlValueAccessor {

  data = "2009/07/12,100,200\n" +
  "2009/07/19,150,201\n";
  options: any = {};

  constructor() { }

  ngOnInit() {
  }

  refreshData() {
    this.options = {
      labels: ["Date", this._value['sku']['skuname'] + " Sales"],
      title: this._value['sku']['skuname'] + " Sales"
    };
    this.data = "2009/07/12,100\n" +
    "2009/07/19,150\n";
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
      if (this._value['sku'] && this._value['allSales']) {
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
