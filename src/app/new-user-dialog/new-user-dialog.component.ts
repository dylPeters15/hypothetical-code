import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.css']
})
export class NewUserDialogComponent implements OnInit {

  hidePassword1: boolean = true;
  hidePassword2: boolean = true;
  usernameExists: boolean = false;

  constructor(private dialogRef: MatDialogRef<NewUserDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  createUser() {
    console.log(this.form.get('admin').value);
    if (this.form.get('username').value && this.form.get('username').value != "" && !this.usernameExists) {
      this.rest.createUser(this.form.get('username').value, this.form.get('password').value, this.form.get('admin').value).subscribe(response => {
        if (response['token']) {
          this.snackBar.open("Successfully created user " + this.form.get('username').value + ".", "close", {
            duration: 2000,
          });
          this.closeDialog();
        } else {
          this.snackBar.open("Error creating user " + this.form.get('username').value + ". Please refresh and try again.", "close", {});
        }
      });
    }
  }

  form = new FormGroup(
    {
      username: new FormControl(''),
      password: new FormControl('password', [Validators.minLength(4)]),
      confirm: new FormControl('password', Validators.minLength(4)),
      admin: new FormControl(false)
    },
    passwordMatchValidator
  );

  passwordErrorMatcher = {
    isErrorState: (control: FormControl, form: FormGroupDirective): boolean => {
      const controlInvalid = control.touched && control.invalid;
      const formInvalid = control.touched && this.form.get('confirm').touched && this.form.invalid;
      return controlInvalid || formInvalid || !!passwordMatchValidator(this.form);
    }
  }

  userErrorMatcher = {
    isErrorState: (control: FormControl, form: FormGroupDirective): boolean => {
      const controlInvalid = control.touched && control.invalid;
      const formInvalid = control.touched && this.form.get('username').touched && this.form.invalid;
      return controlInvalid || formInvalid || this.usernameExists;
    }
  }

  usernameChanged() {
    this.rest.getUsers(this.form.get('username').value, "", null, 1).subscribe(result => {
      this.usernameExists = result.length == 1;
    });
  }

}

function passwordMatchValidator(g: FormGroup) {
  const password = g.get('password').value;
  const confirm = g.get('confirm').value
  return password === confirm ? null : { mismatch: true };
}