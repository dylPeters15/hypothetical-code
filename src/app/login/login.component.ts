import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { auth } from '../auth.service';
import * as querystring from 'querystring';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  products: any = [];

  constructor(public rest: RestService, private route: ActivatedRoute, private router: Router) { }

  myusername: string;

  mypassword: string;

  failedLogin: boolean = false;

  ngOnInit() {
    console.log(window.location.href);
    if (window.location.hash.length > 0) {
      var token = querystring.parse(window.location.hash.substring(1)).access_token;
      if (token) {
        console.log(token);
        this.rest.getNetID(token).subscribe(response => {
          var netid = response['netid'];
          if (netid) {
            console.log(netid);
          }
          console.log(response);
        });
      }
    }
  }

  login(): void {
    this.rest.loginRequest(this.myusername, this.mypassword).subscribe(
      (data: {}) => {
        if (data['token']) {
          //logged in successfully
          this.failedLogin = false;
          auth.storeLogin(this.myusername, data['token'], data['admin']);
          this.router.navigateByUrl('/home');
        } else {
          //incorrect login
          this.failedLogin = true;
          auth.clearLogin();
        }
      }
    );
  }

  netid(): void {
    var redirectURI = 'https://localhost/login';
    var url: string = encodeURI('https://oauth.oit.duke.edu/oauth/authorize.php?response_type=token&redirect_uri='+redirectURI+'&scope=identity:netid:read&client_id=localhost&client_secret=4sqNKIcu%*H7$9=QPKG3Qx=n=9I3zqmnDwZ14MaaFYS3Wx86*p&state=1234');
    console.log(url);
    // Simulate an HTTP redirect:
window.location.replace(url);

  }

}
