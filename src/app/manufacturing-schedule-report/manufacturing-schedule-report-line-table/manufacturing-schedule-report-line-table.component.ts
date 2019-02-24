import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ManufacturingScheduleReportCalculatorService } from '../manufacturing-schedule-report-calculator.service';

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

  constructor(public calc: ManufacturingScheduleReportCalculatorService) { }

  ngOnInit() {
  }

  refreshData(): void {
    this.calc.getActivities(this._value['selectedLine'], this._value['startDate'], this._value['endDate']).then(result => {
      this.tableData = result;
    });
  }
  
  _value = '';
  stringified = '';
  tableData: any;
  displayedColumns = ['startDate', 'endDate', 'duration', 'skuNameNum', 'formulaNameNum', 'numCases'];

  propagateChange: any = () => { };

  writeValue(value: any) {
    if (value) {
      this._value = value;
      this.stringified = JSON.stringify(value);
      this.refreshData();
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
