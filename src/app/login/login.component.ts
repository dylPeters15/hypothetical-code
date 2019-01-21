import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {MatDialog} from '@angular/material'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  username: string;
  
  password: string;
  
    ngOnInit() {
  
    }

  login() : void {
    console.log("Username: ");
    console.log(this.username);
    console.log("Password: ");
    console.log(this.password);
  }

}
