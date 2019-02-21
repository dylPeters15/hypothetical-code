import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-manufacturing-schedule-report-line-table',
  templateUrl: './manufacturing-schedule-report-line-table.component.html',
  styleUrls: ['./manufacturing-schedule-report-line-table.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ManufacturingScheduleReportLineTableComponent),
    multi: true
  }]
})
export class ManufacturingScheduleReportLineTableComponent implements OnInit, ControlValueAccessor {

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
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void { }

  onChange(event) {
    this.stringified = JSON.stringify(event.target.value);
    this.propagateChange(event.target.value);
  }

}
