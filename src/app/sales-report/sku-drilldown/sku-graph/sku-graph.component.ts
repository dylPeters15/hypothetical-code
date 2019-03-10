import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
var moment = require('moment');

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

  data = "";
  options: any = {};

  constructor() { }

  ngOnInit() {
  }

  refreshData() {
    this.options = {
      labels: ["Date", this._value['sku']['skuname'] + " Revenue"],
      title: this._value['sku']['skuname'] + " Revenue"
    };
    this.data = this.formatSalesByWeek();
  }

  formatSalesByWeek(): string {
    var toReturn = "";
    console.log(this._value['salesByWeek']);
    for (let sale of this._value['salesByWeek']) {
      console.log("Sale", sale);
      var date: Date = new Date(Number(sale['year']),0,0,0,0,0,0);
      var dateAsString = moment(date).add(Number(sale['weeknumber']), 'weeks').format('MM/DD/YYYY');
      console.log("Date as string: ", dateAsString);
      toReturn += dateAsString;
      toReturn += ",";
      toReturn += sale['revenue'];
      toReturn += "\n";
    }
    return toReturn;
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
      if (this._value['sku'] && this._value['salesByWeek']) {
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
