import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-manufacturing-schedule-report-ingredient-table',
  templateUrl: './manufacturing-schedule-report-ingredient-table.component.html',
  styleUrls: ['./manufacturing-schedule-report-ingredient-table.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ManufacturingScheduleReportIngredientTableComponent),
    multi: true
  }]
})
export class ManufacturingScheduleReportIngredientTableComponent implements OnInit, ControlValueAccessor {

  constructor() { }

  ngOnInit() {
  }

  _value = '';
  stringified = '';

  propagateChange: any = () => { };

  writeValue(value: any) {
    if (value) {
      this._value = value;
      this.stringified = JSON.stringify(value);
    }
    console.log("VALUE:",value);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void { }

  onChange(event) {
    this.stringified = JSON.stringify(event.target.value);
    this.propagateChange(event.target.value);
    console.log("EVENT:",event);
  }

}
