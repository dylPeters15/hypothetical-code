import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { auth } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  products:any = [];

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }
  
  myusername: string;
  
  mypassword: string;

  failedLogin: boolean = false;
  
    ngOnInit() {
  
    }

  login() : void {
    this.rest.loginRequest(this.myusername, this.mypassword).subscribe(
      (data: {}) => {
        console.log(data);
        if (data['token']) {
          //logged in successfully
          this.failedLogin = false;
          auth.storeLogin(this.myusername, data['token']);
          this.router.navigateByUrl('/home');
        } else {
          //incorrect login
          this.failedLogin = true;
          auth.clearLogin();
        }
      }
    );
}

}
