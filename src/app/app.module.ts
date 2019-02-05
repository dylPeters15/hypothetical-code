<<<<<<< HEAD
import { HttpClientModule } from '@angular/common/http';
import { NgModule, ViewChild } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from "@angular/router";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomMaterialModule } from "./core/material.module";
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SkuInventoryComponent } from './sku-inventory/sku-inventory.component';
import { IngredientInventoryComponent } from './ingredient-inventory/ingredient-inventory.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UserRouteGuardService } from './user-route-guard.service';
import { AdminRouteGuardService } from './admin-route-guard.service';
import { AlreadyLoggedInRouteGuardService } from './already-logged-in-route-guard.service';
import { LogoutComponent } from './logout/logout.component';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule, MatIcon} from '@angular/material/icon';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { UserNotificationDialogComponent } from './user-notification-dialog/user-notification-dialog.component';
import { ManufacturingCalculatorComponent } from './manufacturing-calculator/manufacturing-calculator.component';
import { IngredientDependencyComponent } from './ingredient-dependency-report/ingredient-dependency-report.component';
import { MatTableModule, MatSortModule } from '@angular/material';
import {MatSnackBarModule, MatPaginatorModule, MAT_DIALOG_DATA} from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserManagementComponent } from './user-management/user-management.component';
import { NewUserDialogComponent } from './new-user-dialog/new-user-dialog.component';
import { NewSkuDialogComponent } from './new-sku-dialog/new-sku-dialog.component';
import { NewIngredientDialogComponent } from './new-ingredient-dialog/new-ingredient-dialog.component';
import { MoreInfoDialogComponent } from './more-info-dialog/more-info-dialog.component';
import { PasswordConfirmationDialogComponent } from './password-confirmation-dialog/password-confirmation-dialog.component'; 
import { PrivacyPolicyDialogComponent } from './privacy-policy-dialog/privacy-policy-dialog.component';
import { TermsAndConditionsDialogComponent } from './terms-and-conditions-dialog/terms-and-conditions-dialog.component'; 

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Log In' }, canActivate: [AlreadyLoggedInRouteGuardService] },
  { path: 'user-management', component: UserManagementComponent, data: { title: 'User Management' }, canActivate: [AdminRouteGuardService] },
  { path: 'home', component: HomeComponent, data: { title: 'Home' }, canActivate: [UserRouteGuardService] },
  { path: 'user-management', component: HomeComponent, data: { title: 'User Management' }, canActivate: [AdminRouteGuardService] },
  { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Account Settings' }, canActivate: [UserRouteGuardService] },
  { path: 'account-settings', component: HomeComponent, data: { title: 'Account Settings' }, canActivate: [UserRouteGuardService] },
  { path: 'manufacturing-calculator', component: ManufacturingCalculatorComponent, data: { title: 'Manufacturing Calculator' }, canActivate: [UserRouteGuardService] },
  { path: 'ingredient-dependency-report', component: IngredientDependencyComponent, data: { title: 'Ingredient Dependency Report' }, canActivate: [UserRouteGuardService] },
  { path: 'manufacturing-goal', component: HomeComponent, data: { title: 'Manufacturing Goals' }, canActivate: [UserRouteGuardService] },
  { path: 'ingredient-inventory', component: IngredientInventoryComponent, data: { title: 'Ingredient Inventory' }, canActivate: [AdminRouteGuardService] },
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
    IngredientInventoryComponent,
    NewSkuDialogComponent,
    NewIngredientDialogComponent,
    MoreInfoDialogComponent,
    ManufacturingCalculatorComponent,
    IngredientDependencyComponent,
    UserManagementComponent,
    NewUserDialogComponent,
    PasswordConfirmationDialogComponent,
    PrivacyPolicyDialogComponent,
    TermsAndConditionsDialogComponent
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
  entryComponents: [UserNotificationDialogComponent, NewUserDialogComponent, PasswordConfirmationDialogComponent, PrivacyPolicyDialogComponent, TermsAndConditionsDialogComponent, MoreInfoDialogComponent, NewSkuDialogComponent, NewIngredientDialogComponent]
})
export class AppModule { }
=======
import { HttpClientModule } from '@angular/common/http';
import { NgModule, ViewChild } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from "@angular/router";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomMaterialModule } from "./core/material.module";
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SkuInventoryComponent } from './sku-inventory/sku-inventory.component';
import { IngredientInventoryComponent } from './ingredient-inventory/ingredient-inventory.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UserRouteGuardService } from './user-route-guard.service';
import { AdminRouteGuardService } from './admin-route-guard.service';
import { AlreadyLoggedInRouteGuardService } from './already-logged-in-route-guard.service';
import { LogoutComponent } from './logout/logout.component';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule, MatIcon} from '@angular/material/icon';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { UserNotificationDialogComponent } from './user-notification-dialog/user-notification-dialog.component';
import { ManufacturingCalculatorComponent } from './manufacturing-calculator/manufacturing-calculator.component';
import { IngredientDependencyComponent } from './ingredient-dependency-report/ingredient-dependency-report.component';
import { MatTableModule, MatSortModule } from '@angular/material';
import {MatSnackBarModule, MatPaginatorModule, MAT_DIALOG_DATA} from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserManagementComponent } from './user-management/user-management.component';
import { NewUserDialogComponent } from './new-user-dialog/new-user-dialog.component';
import { NewSkuDialogComponent } from './new-sku-dialog/new-sku-dialog.component';
import { NewIngredientDialogComponent } from './new-ingredient-dialog/new-ingredient-dialog.component';
import { MoreInfoDialogComponent } from './more-info-dialog/more-info-dialog.component';
import { PasswordConfirmationDialogComponent } from './password-confirmation-dialog/password-confirmation-dialog.component'; 
import { PrivacyPolicyDialogComponent } from './privacy-policy-dialog/privacy-policy-dialog.component';
import { TermsAndConditionsDialogComponent } from './terms-and-conditions-dialog/terms-and-conditions-dialog.component'; 
import { ManufacturingGoalsComponent } from './manufacturing-goals/manufacturing-goals.component';
import { NewGoalDialogComponent } from './new-goal-dialog/new-goal-dialog.component';
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Log In' }, canActivate: [AlreadyLoggedInRouteGuardService] },
  { path: 'user-management', component: UserManagementComponent, data: { title: 'User Management' }, canActivate: [AdminRouteGuardService] },
  { path: 'home', component: HomeComponent, data: { title: 'Home' }, canActivate: [UserRouteGuardService] },
  { path: 'user-management', component: HomeComponent, data: { title: 'User Management' }, canActivate: [AdminRouteGuardService] },
  { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Account Settings' }, canActivate: [UserRouteGuardService] },
  { path: 'account-settings', component: HomeComponent, data: { title: 'Account Settings' }, canActivate: [UserRouteGuardService] },
  { path: 'manufacturing-calculator', component: ManufacturingCalculatorComponent, data: { title: 'Manufacturing Calculator' }, canActivate: [UserRouteGuardService] },
  { path: 'ingredient-dependency-report', component: IngredientDependencyComponent, data: { title: 'Ingredient Dependency Report' }, canActivate: [UserRouteGuardService] },
  { path: 'manufacturing-goal', component: ManufacturingGoalsComponent, data: { title: 'Manufacturing Goals' }, canActivate: [UserRouteGuardService] },
  { path: 'ingredient-inventory', component: IngredientInventoryComponent, data: { title: 'Ingredient Inventory' }, canActivate: [UserRouteGuardService] },
  { path: 'sku-inventory', component: SkuInventoryComponent, data: { title: 'SKU Inventory' }, canActivate: [UserRouteGuardService] },
  { path: 'product-line-inventory', component: HomeComponent, data: { title: 'Product Line Inventory' }, canActivate: [UserRouteGuardService] },
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
    IngredientInventoryComponent,
    NewSkuDialogComponent,
    NewIngredientDialogComponent,
    MoreInfoDialogComponent,
    ManufacturingCalculatorComponent,
    IngredientDependencyComponent,
    UserManagementComponent,
    NewUserDialogComponent,
    PasswordConfirmationDialogComponent,
    PrivacyPolicyDialogComponent,
    TermsAndConditionsDialogComponent,
    ManufacturingGoalsComponent,
    NewGoalDialogComponent
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
  entryComponents: [UserNotificationDialogComponent, NewUserDialogComponent, PasswordConfirmationDialogComponent, PrivacyPolicyDialogComponent, TermsAndConditionsDialogComponent, MoreInfoDialogComponent, NewSkuDialogComponent, NewIngredientDialogComponent, NewGoalDialogComponent]
})
export class AppModule { }
>>>>>>> b951fb2642a3fed03a10c4768aaf3dfdf4f26350
