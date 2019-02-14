import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RestService } from '../rest.service';
import { ParseCsvService } from '../parse-csv.service';
import { ImportMatchConflictNewCheckerService } from '../import-match-conflict-new-checker.service';

@Component({
  selector: 'app-upload',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent  implements OnInit {
  @ViewChild('fileSelector') fileSelector;

  constructor(private parser: ParseCsvService, private importChecker: ImportMatchConflictNewCheckerService, public dialog: MatDialog, public rest:RestService) {}

  openFileSelector() {
    this.fileSelector.nativeElement.click();
  }

  ngOnInit() {
  }

  filesSelected() {
    this.parser.parseCSVFiles(this.fileSelector.nativeElement.files).then(csvResult => {
      console.log(csvResult);
      this.importChecker.checkAll(csvResult).then(checkResult => {
        console.log(checkResult);
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }
}
