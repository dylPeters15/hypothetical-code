import { Component, OnInit } from '@angular/core';
import { MAT_DRAWER_DEFAULT_AUTOSIZE } from '@angular/material';
import * as myGlobals from '../../globals';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  loggedin: boolean = false;

  constructor() {
    myGlobals.userloggedin.subscribe(loggedinvalue => {
      this.loggedin = loggedinvalue;
    });
   }

  ngOnInit() {
  }

}
