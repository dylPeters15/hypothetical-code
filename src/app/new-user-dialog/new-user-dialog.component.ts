import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.css']
})
export class NewUserDialogComponent implements OnInit {

  username: string = '';
  password: string = 'password';

  constructor(private dialogRef: MatDialogRef<NewUserDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  createUser() {
    console.log("Username: " + this.username);
    console.log("Password: " + this.password);
  }

}
