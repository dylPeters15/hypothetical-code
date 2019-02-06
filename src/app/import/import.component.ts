import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog.component';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-upload',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent  implements OnInit {
  constructor(public dialog: MatDialog, public rest:RestService) {}

  public openImportDialog() {
    let dialogRef = this.dialog.open(DialogComponent, { width: '50%', height: '50%' });
  }

  ngOnInit() {
  }
}
