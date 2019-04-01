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
  
  hidePassword: boolean = true;

  ngOnInit() {
    if (window.location.hash.length > 0) {
      var netidtoken = querystring.parse(window.location.hash.substring(1)).access_token;
      if (netidtoken) {
        this.rest.loginRequest("", "", netidtoken).subscribe(response => {
          var username = response['username'];
          var token = response['token'];
          var admin = response['admin'];
          if (username && token && admin!==null) {
            this.failedLogin = false;
            auth.storeLogin(username, token, response['analyst'], response['productmanager'], response['businessmanager'], admin, false);
            this.router.navigateByUrl('/home');
          } else {
            //incorrect login
            this.failedLogin = true;
            auth.clearLogin();
          }
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
          auth.storeLogin(this.myusername, data['token'], data['analyst'], data['productmanager'], data['businessmanager'], data['admin'], true);
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
    var redirectURL = 'https://'+this.rest.serverLocation+'/login';
    console.log("Redirect URL: ",redirectURL);
    var clientID = this.rest.getClientID();
    console.log("Client ID: ",clientID);
    var clientSecret = this.rest.getClientSecret();
    console.log("Client Secret: ",clientSecret);
    var url: string = 'https://oauth.oit.duke.edu/oauth/authorize.php?state=1234&response_type=token&redirect_uri=' + redirectURL + '&scope=identity:netid:read&client_id=' + clientID + '&client_secret=' + clientSecret;
    console.log(url);
    var uri = encodeURI(url);
    console.log(uri);
    // Simulate an HTTP redirect:
    window.location.replace(uri);

  }

}
