import { Injectable, HostListener } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { auth } from '../auth.service';
import { RestServiceV2, AndVsOr } from '../restv2.service';
// import { SidenavServiceService } from '../sidenav-service.ts';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  public sideNav:MatSidenav;
  constructor() { }
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  @HostListener('window:beforeprint',['$event'])
    onBeforePrint(event){
    console.log('Before print');
    this.sidenavService.sideNav.close();
  }


  @ViewChild('drawer') public sideNav:MatSidenav;
  loggedin: boolean = false;
  admin: boolean = false;
  productmanager: boolean = false;
  businessmanager: boolean = false;
  analyst: boolean = false;
  public manufacturinglinestomanage: any[] = [];
  public numManufacturingLines = 0;

  constructor(private sidenavService: SidenavService, public restv2: RestServiceV2) {
    
   }

   isAuthenticatedForUserOperation() {
    return auth.isAuthenticatedForUserOperation();
   }


  ngOnInit() {
    this.sidenavService.sideNav = this.sideNav;
    auth.getLoggedInObservable().subscribe(value => {
      this.loggedin = value;
      this.admin = auth.isAuthenticatedForAdminOperation();
      this.productmanager = auth.isAuthenticatedForProductManagerOperation();
      this.businessmanager = auth.isAuthenticatedForBusinessManagerOperation();
      this.analyst = auth.isAuthenticatedForAnalystOperation();
      console.log(this.admin);
      console.log(this.productmanager);
      console.log(this.businessmanager);
      console.log(this.analyst);
      this.refreshMLs();
      var thisobject = this;
      setInterval(() => {
        thisobject.refreshMLs();
      }, 5000);
      if(!this.loggedin) {
        this.sidenavService.sideNav.close();
      } else {
        this.sidenavService.sideNav.open();
      }
    });
  }

  refreshMLs() {
    var thisobject = this;
    this.restv2.getUsers(AndVsOr.AND, auth.getUsername(), null, null, null, null, null, null, auth.getLocal(), 1).then(users => {
      if (users.length == 1) {
        thisobject.manufacturinglinestomanage = users[0].manufacturinglinestomanage;
      }
    }).catch(err => {});
  }

}
