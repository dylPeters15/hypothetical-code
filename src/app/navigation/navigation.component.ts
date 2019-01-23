import { Component, OnInit } from '@angular/core';
import { userloggedin, usertoken } from '../login/login.component'
import { MAT_DRAWER_DEFAULT_AUTOSIZE } from '@angular/material';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  loggedin: boolean = false;

  constructor() {
    userloggedin.subscribe(loggedinvalue => {
      this.loggedin = loggedinvalue;
    });
   }

  ngOnInit() {
  }

}
