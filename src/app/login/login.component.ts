import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  products:any = [];

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }
  
  username: string;
  
  password: string;

  token: string;

  failedLogin: boolean = false;
  
    ngOnInit() {
  
    }

  login() : void {
    console.log("Username: ");
    console.log(this.username);
    console.log("Password: ");
    console.log(this.password);
    this.rest.sendLoginRequest(this.username, this.password).subscribe(
      (data: {}) => {
        console.log(data);
        if (data['token']) {
          console.log("logged in");
          this.token = data['token'];
        } else {
          console.log("not logged in");
          this.failedLogin = true;
        }
      }
    )
}

}
