import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-manufacturing-schedule-report',
  templateUrl: './manufacturing-schedule-report.component.html',
  styleUrls: ['./manufacturing-schedule-report.component.css']
})
export class ManufacturingScheduleReportComponent implements OnInit {

  constructor(public rest:RestService) { }

  lines: any[];
  options: any = {
    selectedLine:null,
    startDate: new Date(),
    endDate: new Date(new Date().setUTCFullYear(new Date().getUTCFullYear()+1))
  }

  ngOnInit() {
    this.options.startDate.setHours(0,0,0,0);
    this.options.endDate.setHours(23,59,59,999);
    this.rest.getLine("",".*","",".*",100).subscribe(result => {
      this.lines = result;
      if (result.length > 0) {
        this.options.selectedLine = result[0]['linename'];
      }
      this.selectionChange();
    });
  }

  selectionChange() {
    if (this.options && this.options.selectedLine && this.options.startDate && this.options.endDate) {
      this.options = {
        selectedLine: this.options.selectedLine,
        startDate: this.options.startDate,
        endDate: this.options.endDate
      };
    }
  }

}
