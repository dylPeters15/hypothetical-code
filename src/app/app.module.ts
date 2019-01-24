import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import {RouterModule, Routes} from "@angular/router";
import {CustomMaterialModule} from "./core/material.module";
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';

import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module'

import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';

import { UserRouteGuardService } from './user-route-guard.service';
import { AdminRouteGuardService } from './admin-route-guard.service';

const appRoutes: Routes = [
  { path: '', component: LoginComponent, data: { title: 'Log In' } },
  { path: 'login', component: LoginComponent, data: { title: 'Log In' } },
  { path: 'home', component: HomeComponent, data: { title: 'Home' }, canActivate: [UserRouteGuardService] },
  { path: 'manufacturing-calculator', component: HomeComponent, data: { title: 'Manufacturing Calculator' } },
  { path: 'ingredient-dependency-report', component: HomeComponent, data: { title: 'Ingredient Dependency Report' } },
  { path: 'manufacturing-goal', component: HomeComponent, data: { title: 'Manufacturing Goals' } },
  { path: 'ingredient-inventory', component: HomeComponent, data: { title: 'Ingredient Inventory' } },
  { path: 'sku-inventory', component: HomeComponent, data: { title: 'SKU Inventory' } },
  { path: 'product-line-inventory', component: HomeComponent, data: { title: 'Product Line Inventory' } },
  { path: 'import-export', component: HomeComponent, data: { title: 'Import Export' } },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    LoginComponent,
    UserComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash: false }
    ),
    CustomMaterialModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }