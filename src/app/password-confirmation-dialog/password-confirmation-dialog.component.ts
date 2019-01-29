import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-password-confirmation-dialog',
  templateUrl: './password-confirmation-dialog.component.html',
  styleUrls: ['./password-confirmation-dialog.component.css']
})
export class PasswordConfirmationDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PasswordConfirmationDialogComponent>) { }

  hidePassword: boolean = true;
  password: string = '';

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close({validated:false});
  }

  submit() {
    this.dialogRef.close({validated:true});
  }

}
