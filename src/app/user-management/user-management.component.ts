import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatDialogConfig } from "@angular/material";
import { NewUserDialogComponent } from '../new-user-dialog/new-user-dialog.component'
/**
 * @title Table dynamically changing the columns displayed
 */
@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
  })
export class UserManagementComponent implements OnInit {

  constructor(public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  displayedColumns: string[] = ['checked', 'username', 'actions'];
  data = [];
  dialogRef: MatDialogRef<NewUserDialogComponent>;

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.rest.sendUserListRequest().subscribe(response => {
      this.data = response['userlist'].filter((value, index, arr) => {
        return value.username != 'admin';
      });
      this.data.forEach(user => {
        user['checked'] = false;
      });
      this.sortData();
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    this.dialogRef = this.dialog.open(NewUserDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  sortData() {
    this.data.sort((a,b) => {
      return a.username > b.username ? 1 : -1;
    });
  }

  deleteUser(username) {
    this.rest.sendAdminDeleteUserRequest(username).subscribe(response => {
      this.snackBar.open("User " + username + " deleted successfully.", "close", {
        duration: 2000,
      });
      this.data = this.data.filter((value, index, arr) => {
        return value.username != username;
      });
      this.sortData();
    })
  }

  newUser() {
    this.openDialog();
  }

  deleteSelected() {
    this.data.forEach(user => {
      if (user.checked) {
        this.deleteUser(user.username);
      }
    });
  }

  deselectAll() {
    this.data.forEach(user => {
      user.checked = false;
    });
  }

  selectAll() {
    this.data.forEach(user => {
      user.checked = true;
    });
  }

}