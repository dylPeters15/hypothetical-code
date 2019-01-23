import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of as ObservableOf } from 'rxjs';
import * as myGlobals from '../../globals';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) {
    console.log((myGlobals.token));
    this.rest.sendVerifyTokenRequest(myGlobals.token).subscribe(
      (data: {}) => {
        console.log(data);
        if (!data['verified']) {
          this.router.navigateByUrl('login');
        }
      }
    );
   }

  ngOnInit() {
  }

}
