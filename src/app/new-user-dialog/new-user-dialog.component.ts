import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.css']
})
export class NewUserDialogComponent implements OnInit {

  username: string = '';
  password: string = 'password';
  hidePassword: boolean = false;

  constructor(private dialogRef: MatDialogRef<NewUserDialogComponent>, public rest:RestService) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
    this.username = '';
    this.password = 'password';
  }

  createUser() {
    this.rest.adminCreateNewUser(this.username, this.password).subscribe(response => {
      this.closeDialog();
      if (response['success']) {
        
      } else {

      }
    });
  }

}
