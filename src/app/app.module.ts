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
import { ProductLineComponent } from './product-line/product-line.component';
import { IngredientInventoryComponent } from './ingredient-inventory/ingredient-inventory.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UserRouteGuardService } from './user-route-guard.service';
import { AdminRouteGuardService } from './admin-route-guard.service';
import { AlreadyLoggedInRouteGuardService } from './already-logged-in-route-guard.service';
import { LogoutComponent } from './logout/logout.component';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule, MatIcon} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip'
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { UserNotificationDialogComponent } from './user-notification-dialog/user-notification-dialog.component';
import { ManufacturingCalculatorComponent } from './manufacturing-calculator/manufacturing-calculator.component';
import { IngredientDependencyComponent } from './ingredient-dependency-report/ingredient-dependency-report.component';
import { MatTableModule, MatSortModule } from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatSnackBarModule, MatPaginatorModule, MAT_DIALOG_DATA} from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserManagementComponent } from './user-management/user-management.component';
import { NewUserDialogComponent } from './new-user-dialog/new-user-dialog.component';
import { NewSkuDialogComponent } from './new-sku-dialog/new-sku-dialog.component';
import { NewIngredientDialogComponent } from './new-ingredient-dialog/new-ingredient-dialog.component';
import { NewProductLineDialogComponent } from './new-product-line-dialog/new-product-line-dialog.component';
import { ProductLineTablesComponent } from './product-line/product-line-tables.component';
import { MoreInfoDialogComponent } from './more-info-dialog/more-info-dialog.component';
import { PasswordConfirmationDialogComponent } from './password-confirmation-dialog/password-confirmation-dialog.component'; 
import { PrivacyPolicyDialogComponent } from './footer/privacy-policy-dialog/privacy-policy-dialog.component';
import { TermsAndConditionsDialogComponent } from './footer/terms-and-conditions-dialog/terms-and-conditions-dialog.component'; 
import { ManufacturingGoalsComponent } from './manufacturing-goals/manufacturing-goals.component';
import { NewGoalDialogComponent } from './new-goal-dialog/new-goal-dialog.component';
import { ImportComponent } from './import/import.component';
import { PapaParseModule } from 'ngx-papaparse';
import { MatRadioModule } from '@angular/material/radio';
import { ConfirmActionDialogComponent } from './confirm-action-dialog/confirm-action-dialog.component';
import { ImportPreviewDialogComponent } from './import/import-preview-dialog/import-preview-dialog.component';
import { ImportConflictResolverComponent } from './import/import-conflict-resolver/import-conflict-resolver.component';
import { RecordImportPreviewComponent } from './import/record-import-preview/record-import-preview.component';
import { ImportPreviewSectionComponent } from './import/import-preview-section/import-preview-section.component';
import { ExistingRecordPreviewComponent } from './import/existing-record-preview/existing-record-preview.component';
import { NewLineDialogComponent } from './new-line-dialog/new-line-dialog.component';
import { ManufacturingLinesComponent } from './manufacturing-lines/manufacturing-lines.component';
import { ManufacturingScheduleComponent } from './manufacturing-schedule/manufacturing-schedule.component';

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
  { path: 'manufacturing-lines', component: ManufacturingLinesComponent, data: { title: 'Manufacturing Lines' }, canActivate: [UserRouteGuardService] },
  { path: 'ingredient-inventory', component: IngredientInventoryComponent, data: { title: 'Ingredient Inventory' }, canActivate: [UserRouteGuardService] },
  { path: 'sku-inventory', component: SkuInventoryComponent, data: { title: 'SKU Inventory' }, canActivate: [UserRouteGuardService] },
  { path: 'product-line', component: ProductLineComponent, data: { title: 'Product Line Inventory' }, canActivate: [UserRouteGuardService] },
  { path: 'import', component: ImportComponent, data: { title: 'Import' }, canActivate: [AdminRouteGuardService] },
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
    ProductLineComponent,
    IngredientInventoryComponent,
    NewSkuDialogComponent,
    NewIngredientDialogComponent,
    NewProductLineDialogComponent,
    ProductLineTablesComponent,
    MoreInfoDialogComponent,
    ManufacturingCalculatorComponent,
    IngredientDependencyComponent,
    UserManagementComponent,
    NewUserDialogComponent,
    PasswordConfirmationDialogComponent,
    PrivacyPolicyDialogComponent,
    TermsAndConditionsDialogComponent,
    ManufacturingGoalsComponent,
    NewGoalDialogComponent,
    ImportComponent,
    ConfirmActionDialogComponent,
    ImportPreviewDialogComponent,
    ImportConflictResolverComponent,
    RecordImportPreviewComponent,
    ImportPreviewSectionComponent,
    ExistingRecordPreviewComponent,
    ManufacturingLinesComponent,
    NewLineDialogComponent,
    ManufacturingScheduleComponent,
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
    MatTooltipModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatPaginatorModule,
    PapaParseModule,
    MatRadioModule,
    MatChipsModule,
    MatAutocompleteModule,   
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [UserNotificationDialogComponent, NewUserDialogComponent, PasswordConfirmationDialogComponent, PrivacyPolicyDialogComponent, TermsAndConditionsDialogComponent, MoreInfoDialogComponent, NewSkuDialogComponent, NewIngredientDialogComponent, NewGoalDialogComponent, NewProductLineDialogComponent, ConfirmActionDialogComponent, ImportPreviewDialogComponent, NewLineDialogComponent]
})
export class AppModule { }
