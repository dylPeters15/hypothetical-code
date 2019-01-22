import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';

import {MatDialog} from '@angular/material'
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
  
    ngOnInit() {
  
    }

  login() : void {
    console.log("Username: ");
    console.log(this.username);
    console.log("Password: ");
    console.log(this.password);
    this.rest.login(this.username, this.password).subscribe(
      (data: {}) => {
        console.log(data);
      }
    )
}

  getProducts() {
    this.products = [];
    this.rest.getProducts().subscribe((data: {}) => {
      console.log(data);
      this.products = data;
    });
  }

  add() {
    this.router.navigate(['/product-add']);
  }

  delete(id) {
    this.rest.deleteProduct(id)
      .subscribe(res => {
          this.getProducts();
        }, (err) => {
          console.log(err);
        }
      );
  }

}
