import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-upload',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent  implements OnInit {
  constructor(public dialog: MatDialog, public rest:RestService) {}

  public openFileSelector() {
    
  }

  ngOnInit() {
  }
}
