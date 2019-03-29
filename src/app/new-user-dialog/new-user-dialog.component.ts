import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MatAutocomplete} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { RestServiceV2, AndVsOr } from '../restv2.service';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.css']
})
export class NewUserDialogComponent implements OnInit {

  selectedMfgLines: any[] = [];
  separatorKeysCodes: number[] = [ENTER];
  mfgLineCtrl = new FormControl();
  autoCompleteMfgLines: Observable<string[]> = new Observable(observer => {
    this.mfgLineCtrl.valueChanges.subscribe(async newVal => {
      var regex = "(?i).*"+newVal+".*";
      var linesFromDB: any[] = await this.restv2.getLine(AndVsOr.AND, null, regex, null, regex, 1000);
      var filteredLines = linesFromDB.filter((value,index,array) => {
        for (let selectedLine of this.selectedMfgLines) {
          if (selectedLine.linename == value.linename) {
            return false;
          }
        }
        return true;
      })
      observer.next(filteredLines);
    });
  });
  @ViewChild('mfgLineInput') mfgLineInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  remove(mfgLine) {
    this.selectedMfgLines.splice(this.selectedMfgLines.indexOf(mfgLine),1);
  }
  selected(event){
    this.selectedMfgLines.push(event.option.value);
  }
  add(event) {
    this.mfgLineInput.nativeElement.value = "";
  }



  hidePassword1: boolean = true;
  hidePassword2: boolean = true;
  usernameExists: boolean = false;

  constructor(public restv2:RestServiceV2, private dialogRef: MatDialogRef<NewUserDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  createUser() {
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
      analyst: new FormControl(false),
      productmanager: new FormControl(false),
      businessmanager: new FormControl(false),
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
    this.rest.getUsers(this.form.get('username').value, "", null, true, 1).subscribe(result => {
      this.usernameExists = result.length == 1;
    });
  }

}

function passwordMatchValidator(g: FormGroup) {
  const password = g.get('password').value;
  const confirm = g.get('confirm').value
  return password === confirm ? null : { mismatch: true };
}