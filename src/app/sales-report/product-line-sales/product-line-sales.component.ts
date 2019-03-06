import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RestServiceV2, AndVsOr } from '../../restv2.service';

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

  skus: any[] = [];

  constructor(public restv2: RestServiceV2) { }

  ngOnInit() {

  }

  async refreshData() {
    //this.skus = await this.restv2.getPro
    //getSales(AndVsOr.AND, this._value['_id'], null, null, null, 10000);
    console.log("This.skus: ",this.skus);
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
      console.log(this._value);
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
