import { Component, OnInit } from '@angular/core';
import { MAT_DRAWER_DEFAULT_AUTOSIZE } from '@angular/material';
import { auth } from '../auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  loggedin: boolean = false;
  admin: boolean = false;

  constructor() {
    auth.getLoggedInObservable().subscribe(value => {
      this.loggedin = value;
      this.admin = auth.isAuthenticatedForAdminOperation();
    });
   }

  ngOnInit() {
  }

}
