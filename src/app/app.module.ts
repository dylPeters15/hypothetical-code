import { HttpClientModule } from '@angular/common/http';
import { NgModule, ViewChild } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from "@angular/router";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomMaterialModule } from "./core/material.module";
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SkuInventoryComponent } from './sku-inventory/sku-inventory.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UserRouteGuardService } from './user-route-guard.service';
import { AdminRouteGuardService } from './admin-route-guard.service';
import { AlreadyLoggedInRouteGuardService } from './already-logged-in-route-guard.service';
import { LogoutComponent } from './logout/logout.component';
import { IngredientDependencyComponent } from './ingredient-dependency-report/ingredient-dependency-report.component';
import { MatTableModule, MatSortModule } from '@angular/material';
import {MatSnackBarModule, MatPaginatorModule, MAT_DIALOG_DATA} from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select'; 
import {MatIconModule, MatIcon} from '@angular/material/icon';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { UserNotificationDialogComponent } from './user-notification-dialog/user-notification-dialog.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { NewUserDialogComponent } from './new-user-dialog/new-user-dialog.component';
import { NewSkuDialogComponent } from './new-sku-dialog/new-sku-dialog.component';
import { MoreInfoDialogComponent } from './more-info-dialog/more-info-dialog.component';
import { PasswordConfirmationDialogComponent } from './password-confirmation-dialog/password-confirmation-dialog.component'; 

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Log In' }, canActivate: [AlreadyLoggedInRouteGuardService] },
  { path: 'user-management', component: UserManagementComponent, data: { title: 'User Management' }, canActivate: [AdminRouteGuardService] },
  { path: 'home', component: HomeComponent, data: { title: 'Home' }, canActivate: [UserRouteGuardService] },
  { path: 'user-management', component: HomeComponent, data: { title: 'User Management' }, canActivate: [AdminRouteGuardService] },
  { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Account Settings' }, canActivate: [UserRouteGuardService] },
  { path: 'account-settings', component: HomeComponent, data: { title: 'Account Settings' }, canActivate: [UserRouteGuardService] },
  { path: 'manufacturing-calculator', component: HomeComponent, data: { title: 'Manufacturing Calculator' }, canActivate: [UserRouteGuardService] },
  { path: 'ingredient-dependency-report', component: IngredientDependencyComponent, data: { title: 'Ingredient Dependency Report' }, canActivate: [UserRouteGuardService] },
  { path: 'manufacturing-goal', component: HomeComponent, data: { title: 'Manufacturing Goals' }, canActivate: [UserRouteGuardService] },
  { path: 'ingredient-inventory', component: HomeComponent, data: { title: 'Ingredient Inventory' }, canActivate: [AdminRouteGuardService] },
  { path: 'sku-inventory', component: SkuInventoryComponent, data: { title: 'SKU Inventory' }, canActivate: [AdminRouteGuardService] },
  { path: 'product-line-inventory', component: HomeComponent, data: { title: 'Product Line Inventory' }, canActivate: [AdminRouteGuardService] },
  { path: 'import-export', component: HomeComponent, data: { title: 'Import Export' }, canActivate: [AdminRouteGuardService] },
  { path: 'logout', component: LogoutComponent, data: { title: "Logout" }, canActivate: [UserRouteGuardService] },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    LogoutComponent,
    AccountSettingsComponent,
    UserNotificationDialogComponent,
    SkuInventoryComponent,
    IngredientDependencyComponent,
    UserManagementComponent,
    NewUserDialogComponent,
    NewSkuDialogComponent,
    MoreInfoDialogComponent,
    PasswordConfirmationDialogComponent
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
    HttpClientModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [UserNotificationDialogComponent, NewUserDialogComponent, NewSkuDialogComponent, PasswordConfirmationDialogComponent, MoreInfoDialogComponent]
})
export class AppModule { }