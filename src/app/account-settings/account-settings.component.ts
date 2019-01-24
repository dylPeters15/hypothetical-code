import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { RestService } from '../rest.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import { UserNotificationDialogComponent } from '../user-notification-dialog/user-notification-dialog.component';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  hidePassword1: boolean = true;
  hidePassword2: boolean = true;
  hidePassword3: boolean = true;
  dialogRef: MatDialogRef<UserNotificationDialogComponent>;

  constructor(private rest: RestService, private dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(title, message) {
    const dialogConfig = new MatDialogConfig();
    this.dialogRef = this.dialog.open(UserNotificationDialogComponent, dialogConfig);
    this.dialogRef.componentInstance.title = title;
    this.dialogRef.componentInstance.message = message;
}

  changePassword() {
    if (this.passwordsValid()) {
      const newPass = this.form.get('password').value;
      this.rest.sendChangePasswordRequest(newPass).subscribe(response => {
        if (response['success']) {
          this.openDialog("Success!", "Password successfully updated!");
        } else {
          this.openDialog("Error", "There was an error updating your password. Please refresh the page and try again.");
        }
      });
    } else {
      console.log("Passwords invalid.");
    }
  }

  deleteAccount() {
    console.log(this.deleteForm.get('confirmDelete').value);
  }

  form = new FormGroup(
    {
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
