import { Component, OnInit,ViewChild, ElementRef, Inject  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ExportToCsv} from 'export-to-csv';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
@Component({
  selector: 'app-legend-details',
  templateUrl: './legend-details.component.html'
})
export class LegendDetailsComponent implements OnInit {

constructor(private dialogRef: MatDialogRef<LegendDetailsComponent>, private route: ActivatedRoute, private router: Router)  { }

  ngOnInit() {
    
  }

closeDialog() {
  this.dialogRef.close();
}


}