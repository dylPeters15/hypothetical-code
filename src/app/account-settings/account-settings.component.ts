import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormGroupDirective} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  hidePassword1: boolean = true;
  hidePassword2: boolean = true;
  passwordsMatch: boolean = true;
  password1 = new FormControl('', [Validators.required]);
  password2 = new FormControl('', [Validators.required]);
  newPassword1: string;

  constructor() { }

  ngOnInit() {
  }

  changePassword() {
    console.log(this.form.get('password').value);
  }


  form = new FormGroup(
    {
      password: new FormControl('', [Validators.minLength(4)]),
      confirm: new FormControl('', Validators.minLength(4)),
    },
    passwordMatchValidator
  );

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
