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
  selectedLine: string;
  startDate: Date = new Date();
  endDate: Date = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear()+1));

  ngOnInit() {
    this.rest.getLine("",".*","",".*",100).subscribe(result => {
      this.lines = result;
      if (result.length > 0) {
        this.selectedLine = result[0]['linename'];
      }
      this.selectionChange();
    });
  }

  selectionChange() {
    if (this.selectedLine && this.startDate && this.endDate) {
      console.log(this.selectedLine);
      console.log(this.startDate);
      console.log(this.endDate);
    }
  }

}
