import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { RestService } from '../rest.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { UserNotificationDialogComponent } from '../user-notification-dialog/user-notification-dialog.component';
import { Router } from '@angular/router';
import { auth } from '../auth.service';


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  hidePassword0: boolean = true;
  hidePassword1: boolean = true;
  hidePassword2: boolean = true;
  hidePassword3: boolean = true;
  dialogRef: MatDialogRef<UserNotificationDialogComponent>;

  constructor(private rest: RestService, private dialog: MatDialog, public router: Router) { }

  ngOnInit() {
  }

  openDialog(title, message) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = false;
    this.dialogRef = this.dialog.open(UserNotificationDialogComponent, dialogConfig);
    this.dialogRef.componentInstance.title = title;
    this.dialogRef.componentInstance.message = message;
  }

  changePassword() {
    if (this.passwordsValid()) {
      const oldPass = this.form.get('currentPass').value;
      const newPass = this.form.get('password').value;
      this.rest.loginRequest(auth.getUsername(), oldPass).subscribe(loginresponse => {
        if (loginresponse['token']) {
          this.rest.modifyUser(auth.getUsername(), auth.getUsername(), newPass, false).subscribe(response => {
            console.log(response);
            if (response['nModified'] == 1 && response['ok'] == 1) {
              this.openDialog("Success!", "Password changed successfully.");
              this.form.get('currentPass').setValue('');
              this.form.get('password').setValue('');
              this.form.get('confirm').setValue('');
            } else {
              this.openDialog("Unkown Error", "Unable to perform operation.");
            }
          });
        } else {
          this.openDialog("Incorrect password", "Please ensure that you have entered your current password correctly and try again.");
        }
      });
    } else {
      this.openDialog("Incorrect password", "Please ensure that you have entered your current password correctly and try again.");
    }
  }

  deleteAccount() {
    const pass = this.deleteForm.get('confirmDelete').value
    this.rest.loginRequest(auth.getUsername(), pass).subscribe(loginresponse => {
      if (loginresponse['token']) {
        this.rest.deleteUser(auth.getUsername()).subscribe(response => {
          console.log(response);
          if (response['deletedCount'] == 1 && response['ok'] == 1) {
            this.openDialog("Success", "Account deleted successfully. You will be redirected to the login page.");
            auth.clearLogin();
            this.router.navigate(['login']);
          } else {
            this.openDialog("Unkown Error", "Unable to perform operation.");
          }
        });
      } else {
        this.openDialog("Incorrect password", "Please ensure that you have entered your password correctly and try again.");
      }
    })
    // this.rest.sendDeleteAccountRequest(pass).subscribe(response => {
    //   if (response['success']) {
    //     this.openDialog("Success", "Account deleted successfully. You will be redirected to the login page.");
    //     auth.clearLogin();
    //     this.router.navigate(['login']);
    //   } else {
    //     this.openDialog("Error", "There was an error updating your password. Check that you entered your current password correctly and try again.");
    //   }
    // });
  }

  form = new FormGroup(
    {
      currentPass: new FormControl('', []),
      password: new FormControl('', [Validators.minLength(4)]),
      confirm: new FormControl('', Validators.minLength(4)),
    },
    passwordMatchValidator
  );

  deleteForm = new FormGroup(
    {
      confirmDelete: new FormControl('')
    }
  );

  passwordsValid() {
    const pass = this.form.get('password').value;
    const conf = this.form.get('confirm').value;
    return pass == conf && pass != null && pass.length >= 4;
  }

  passwordErrorMatcher = {
    isErrorState: (control: FormControl, form: FormGroupDirective): boolean => {
      const controlInvalid = control.touched && control.invalid;
      const formInvalid = control.touched && this.form.get('confirm').touched && this.form.invalid;
      return controlInvalid || formInvalid;
    }
  }

  confirmErrorMatcher = {
    isErrorState: (control: FormControl, form: FormGroupDirective): boolean => {
      const controlInvalid = control.touched && control.invalid;
      const formInvalid = control.touched && this.form.get('password').touched && this.form.invalid;
      return controlInvalid || formInvalid;
    }
  }

  confirmDeleteErrorMatcher = {
    isErrorState: (control: FormControl, form: FormGroupDirective): boolean => {
      const controlInvalid = control.touched && control.invalid;
      const formInvalid = control.touched && this.deleteForm.get('confirmDelete').touched && this.form.invalid;
      return controlInvalid || formInvalid;
    }
  }

  getErrorMessage(controlName: string) {
    if (this.form.controls[controlName].hasError('minlength')) {
      return 'Must be at least 4 characters'
    }

    return 'Passwords must match'
  }

}

function passwordMatchValidator(g: FormGroup) {
  const password = g.get('password').value;
  const confirm = g.get('confirm').value
  return password === confirm ? null : { mismatch: true };
}
