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
      console.log(this.options.selectedLine);
      console.log(this.options.startDate);
      console.log(this.options.endDate);
    }
  }

}
