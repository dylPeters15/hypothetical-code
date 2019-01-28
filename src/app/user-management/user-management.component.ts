import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

/**
 * @title Table dynamically changing the columns displayed
 */
@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
  })
export class UserManagementComponent implements OnInit {

  constructor(public rest:RestService) { }

  displayedColumns: string[] = ['checked', 'username', 'actions'];
  data = [];

  ngOnInit() {
    this.rest.sendUserListRequest().subscribe(response => {
      this.data = response['userlist'];
      this.data.forEach(user => {
        user['checked'] = false;
      });
    });
  }

  deleteUser(username) {
    this.rest.sendAdminDeleteUserRequest(username).subscribe(response => {
      console.log(response);
    })
  }

  newUser() {
  }

  deleteSelected() {

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