import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { RestService } from '../rest.service';
import { auth } from '../auth.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-password-confirmation-dialog',
  templateUrl: './password-confirmation-dialog.component.html',
  styleUrls: ['./password-confirmation-dialog.component.css']
})
export class PasswordConfirmationDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PasswordConfirmationDialogComponent>, public rest:RestService,  private snackBar: MatSnackBar) { }

  hidePassword: boolean = true;
  password: string = '';

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close({validated:false});
  }

  submit() {
    this.rest.loginRequest(auth.getUsername(), this.password).subscribe(response => {
      if (response['token']) {
        this.dialogRef.close({validated:true});
      } else {
        this.snackBar.open("Incorrect password. Please try again.", "close");
      }
    });
  }

}
