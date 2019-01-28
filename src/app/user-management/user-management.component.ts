import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';

/**
 * @title Table dynamically changing the columns displayed
 */
@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
  })
export class UserManagementComponent implements OnInit {

  constructor(public rest:RestService, private snackBar: MatSnackBar) { }

  displayedColumns: string[] = ['checked', 'username', 'actions'];
  data = [];

  ngOnInit() {
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

  sortData() {
    this.data.sort((a,b) => {
      return a.username > b.username ? 1 : -1;
    });
  }

  deleteUser(username) {
    this.rest.sendAdminDeleteUserRequest(username).subscribe(response => {
      console.log(response);
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