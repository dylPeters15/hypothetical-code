import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-terms-and-conditions-dialog',
  templateUrl: './terms-and-conditions-dialog.component.html',
  styleUrls: ['./terms-and-conditions-dialog.component.css']
})
export class TermsAndConditionsDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<TermsAndConditionsDialogComponent>) { }

  ngOnInit() {
  }

}
