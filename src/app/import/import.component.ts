import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RestService } from '../rest.service';
import { ParseCsvService } from '../parse-csv.service';

@Component({
  selector: 'app-upload',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent  implements OnInit {
  @ViewChild('fileSelector') fileSelector;

  constructor(private parser: ParseCsvService, public dialog: MatDialog, public rest:RestService) {}

  openFileSelector() {
    this.fileSelector.nativeElement.click();
  }

  ngOnInit() {
  }

  filesSelected() {
    this.parser.parseCSVFiles(this.fileSelector.nativeElement.files).then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });

  }
}
