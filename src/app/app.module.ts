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

const appRoutes: Routes = [
  { path: '', component: LoginComponent, data: { title: 'Log In' } },
  { path: 'manufacturing-calculator', component: LoginComponent, data: { title: 'Log In' } },
  { path: 'ingredient-dependency-report', component: LoginComponent, data: { title: 'Log In' } },
  { path: 'manufacturing-goal', component: LoginComponent, data: { title: 'Log In' } },
  { path: 'ingredient-inventory', component: LoginComponent, data: { title: 'Log In' } },
  { path: 'sku-inventory', component: LoginComponent, data: { title: 'Log In' } },
  { path: 'product-line-inventory', component: LoginComponent, data: { title: 'Log In' } },
  { path: 'import-export', component: LoginComponent, data: { title: 'Log In' } }
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    LoginComponent,
    UserComponent
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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }