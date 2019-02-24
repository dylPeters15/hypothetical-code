import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RestService } from '../../rest.service';

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

  constructor(public rest:RestService) { }

  ngOnInit() {
  }

  refreshData(): void {
    this.rest.getActivities(this._value['startDate'],100).subscribe(response => {
      console.log(response);
      this.tableData = response.filter((value,index,array) => {
        return value['line']['linename'] == this._value['selectedLine'];
      });
      console.log("Table data: ", this.tableData);
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
