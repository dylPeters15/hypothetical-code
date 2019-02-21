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
  selectedLineName: string;

  ngOnInit() {
    this.rest.getLine("",".*","",".*",100).subscribe(result => {
      this.lines = result;
    });
  }

  selectionChange(event) {
    this.selectedLineName = event.value;
  }

}
