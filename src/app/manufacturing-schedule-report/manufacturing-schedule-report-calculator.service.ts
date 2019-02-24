import { Injectable } from '@angular/core';
import { RestService } from '../rest.service';
var moment = require('moment');     //please note that you should include moment library first
require('moment-weekday-calc');

@Injectable({
  providedIn: 'root'
})
export class ManufacturingScheduleReportCalculatorService {

  constructor(public rest:RestService) { }

  refreshData(selectedLine: string, startDate: Date, endDate: Date): Promise<any> {
    return new Promise((resolve, reject) => {
      this.rest.getActivities(startDate,100).subscribe(response => {
        console.log(response);
        var data = response.filter((value,index,array) => {
          return value['line']['linename'] == selectedLine;
        });
        console.log("Table data: ", data);
        data.forEach(element => {
          element['sethours'] = element['sethours']||element['calculatedhours'];
          element['startdate'] = new Date(element['startdate']);
          element['enddate'] = this.calculateEndDate(new Date(element['startdate']), element['sethours']);
        });
        data = data.filter((value,index,array) => {
          return value['enddate'] <= endDate;
        });
        resolve(data);
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

}
