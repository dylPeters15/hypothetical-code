import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { RestService } from '../rest.service';
import { auth } from '../auth.service';

@Component({
  selector: 'app-password-confirmation-dialog',
  templateUrl: './password-confirmation-dialog.component.html',
  styleUrls: ['./password-confirmation-dialog.component.css']
})
export class PasswordConfirmationDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PasswordConfirmationDialogComponent>, public rest:RestService) { }

  hidePassword: boolean = true;
  password: string = '';

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close({validated:false});
  }

  submit() {
    this.rest.sendLoginRequest(auth.getUsername(), this.password).subscribe(response => {
      this.dialogRef.close({validated:response['token']!=undefined});
    })
  }

}
