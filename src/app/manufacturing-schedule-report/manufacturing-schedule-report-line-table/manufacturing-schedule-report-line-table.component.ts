import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RestService } from '../../rest.service';
var moment = require('moment');     //please note that you should include moment library first
require('moment-weekday-calc');

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
      this.tableData.forEach(element => {
        element['sethours'] = element['sethours']||element['calculatedhours'];
        element['startdate'] = new Date(element['startdate']);
        element['enddate'] = this.calculateEndDate(new Date(element['startdate']), element['sethours']);
      });
      this.tableData = this.tableData.filter((value,index,array) => {
        return value['enddate'] <= this._value['endDate'];
      });
    });
  }

  calculateEndDate(startDate: Date, hours: Number): Date {
    var endDate = new Date(startDate);
    const NUM_HOURS_PER_DAY = 10;
    while (moment().isoWeekdayCalc([startDate.getUTCFullYear(),startDate.getUTCMonth(),startDate.getUTCDay()],[endDate.getUTCFullYear(),endDate.getUTCMonth(),endDate.getUTCDay()],[2,3,4,5,6])*NUM_HOURS_PER_DAY<hours) {
      endDate.setDate(endDate.getDate()+1);
    }
    return endDate;
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
