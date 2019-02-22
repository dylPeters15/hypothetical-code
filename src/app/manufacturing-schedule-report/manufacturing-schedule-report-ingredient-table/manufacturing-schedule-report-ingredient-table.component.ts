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

  refreshData(): void {

  }

  _value = '';
  stringified = '';
  tableData: any;
  displayedColumns = ['ingredientNum', 'ingredientName', 'quantity', 'numCases'];

  propagateChange: any = () => { };

  writeValue(value: any) {
    if (value) {
      this._value = value;
      this.stringified = JSON.stringify(value);
    }
    this.refreshData();
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
