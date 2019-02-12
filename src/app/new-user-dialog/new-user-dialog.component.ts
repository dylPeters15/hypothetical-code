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

  username: string = '';
  password: string = 'password';
  confirmPassword: string = 'password';
  hidePassword1: boolean = true;
  hidePassword2: boolean = true;

  constructor(private dialogRef: MatDialogRef<NewUserDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
    this.username = '';
    this.password = 'password';
  }

  createUser() {
    this.rest.createUser(this.form.get('username').value, this.form.get('password').value, false).subscribe(response => {
      console.log(response);
      if (response['token']) {
        this.snackBar.open("Successfully created user " + this.username + ".", "close", {
          duration: 2000,
        });
        this.closeDialog();
      } else {
        this.snackBar.open("Error creating user " + this.username + ". Please refresh and try again.", "close", {});
      }
    });
  }

  form = new FormGroup(
    {
      username: new FormControl(''),
      password: new FormControl('password', [Validators.minLength(4)]),
      confirm: new FormControl('password', Validators.minLength(4)),
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

}

function passwordMatchValidator(g: FormGroup) {
  const password = g.get('password').value;
  const confirm = g.get('confirm').value
  return password === confirm ? null : { mismatch: true };
}