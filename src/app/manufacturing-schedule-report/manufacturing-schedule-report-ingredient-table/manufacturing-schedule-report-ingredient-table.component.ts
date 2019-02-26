import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ManufacturingScheduleReportCalculatorService } from '../manufacturing-schedule-report-calculator.service';
import { MatTableDataSource } from '@angular/material';

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

  constructor(public calc: ManufacturingScheduleReportCalculatorService) { }

  ngOnInit() {
  }

  
  sortData(event) {
    console.log("event:",event);
    console.log("data: ",this.tableData);
    this.tableData.data.sort((a,b) => {
      console.log(a[event['active']] > b[event['active']]);
      if (event['direction'] == 'asc') {
        return a[event['active']] > b[event['active']] ? 1 : -1;
      } else {
        return a[event['active']] > b[event['active']] ? -1 : 1;
      }
    });
    this.tableData = new MatTableDataSource(this.tableData.data);
  }

  refreshData(): void {
    if (this._value && this._value['selectedLine'] && this._value['startDate'] && this._value['endDate']) {
      this.calc.getIngredients(this._value['selectedLine'], this._value['startDate'], this._value['endDate']).then(result => {
        this.tableData = new MatTableDataSource(result);
      });
    }
  }
  
  _value = '';
  stringified = '';
  tableData: MatTableDataSource<any>;
  displayedColumns = ['ingredientNumber', 'ingredientName', 'quantity', 'numCases'];

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
