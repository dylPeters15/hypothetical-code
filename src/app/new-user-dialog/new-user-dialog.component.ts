import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.css']
})
export class NewUserDialogComponent implements OnInit {

  username: string = '';
  password: string = 'password';
  hidePassword: boolean = false;

  constructor(private dialogRef: MatDialogRef<NewUserDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
    this.username = '';
    this.password = 'password';
  }

  createUser() {
    this.rest.adminCreateNewUser(this.username, this.password).subscribe(response => {
      if (response['success']) {
        this.snackBar.open("Successfully created user " + this.username + ".", "close", {
          duration: 2000,
        });
      } else {
        this.snackBar.open("Error creating user " + this.username + ". Please refresh and try again.", "close", {
          duration: 2000,
        });
      }
      this.closeDialog();
    });
  }

}