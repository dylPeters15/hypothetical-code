import {Component} from '@angular/core';

/**
 * @title Table dynamically changing the columns displayed
 */
@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
  })
export class UserManagementComponent {
  displayedColumns: string[] = ['checked', 'username', 'actions'];
  data = [
    {checked: true, username: 'asdf'},
    {checked: false, username: 'qwerty'}
  ];

  deleteUser(username) {
    console.log(username);
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