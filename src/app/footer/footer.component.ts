import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import { PrivacyPolicyDialogComponent } from './privacy-policy-dialog/privacy-policy-dialog.component';
import { TermsAndConditionsDialogComponent } from './terms-and-conditions-dialog/terms-and-conditions-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openPrivacyPolicy() {
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(PrivacyPolicyDialogComponent, dialogConfig);
  }

  openTermsAndConditions() {
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(TermsAndConditionsDialogComponent, dialogConfig);
  }

}
