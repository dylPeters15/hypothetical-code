import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of as ObservableOf } from 'rxjs';

var userloggedinBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
export var userloggedin: Observable<boolean> = userloggedinBehaviorSubject.asObservable();
export var usertoken: string = '';
export var username: string = '';

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
    this.rest.sendLoginRequest(this.myusername, this.mypassword).subscribe(
      (data: {}) => {
        console.log(data);
        if (data['token']) {
          //logged in successfully
          this.failedLogin = false;
          usertoken = data['token'];
          username = this.myusername;
          userloggedinBehaviorSubject.next(true);
          this.router.navigateByUrl('/home');
        } else {
          //incorrect login
          this.failedLogin = true;
          usertoken = '';
          username = '';
          userloggedinBehaviorSubject.next(false);
        }
      }
    )
}

}
