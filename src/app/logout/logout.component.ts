import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from '../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(public router: Router) { 
    auth.clearLogin();
    this.router.navigate(['login']);
  }

  ngOnInit() {
  }

}
