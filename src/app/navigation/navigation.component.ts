import { Component, OnInit } from '@angular/core';
import { userloggedin, usertoken } from '../login/login.component'

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor() {
    userloggedin.subscribe(loggedinvalue => {
      console.log("loggedinvalue: " + loggedinvalue);
      console.log("token value: " + usertoken);
    })
   }

  ngOnInit() {
  }

}
