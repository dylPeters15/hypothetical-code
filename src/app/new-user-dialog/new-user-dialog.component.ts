import { Component, OnInit, ViewChild, ElementRef, Optional, Inject } from '@angular/core';
import { MatDialogRef, MatAutocomplete, MAT_DIALOG_DATA } from "@angular/material";
import { RestService } from '../rest.service';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { auth } from '../auth.service';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.css']
})
export class NewUserDialogComponent implements OnInit {

  title = this.initData ? "Modify User Permissions" : "Create New User";
  submitButtonLabel = this.initData ? "Modify" : "Create";

  selectedMfgLines: any[] = [];
  separatorKeysCodes: number[] = [ENTER];
  mfgLineCtrl = new FormControl();
  autoCompleteMfgLines: Observable<string[]> = new Observable(observer => {
    this.mfgLineCtrl.valueChanges.subscribe(async newVal => {
      var regex = "(?i).*" + newVal + ".*";
      var linesFromDB: any[] = await this.restv2.getLine(AndVsOr.AND, null, regex, null, regex, 1000);
      var filteredLines = linesFromDB.filter((value, index, array) => {
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
    this.selectedMfgLines.splice(this.selectedMfgLines.indexOf(mfgLine), 1);
  }
  selected(event) {
    this.selectedMfgLines.push(event.option.value);
  }
  add(event) {
    this.mfgLineInput.nativeElement.value = "";
  }



  hidePassword1: boolean = true;
  hidePassword2: boolean = true;
  usernameExists: boolean = false;

  constructor(public restv2: RestServiceV2, private dialogRef: MatDialogRef<NewUserDialogComponent>, public rest: RestService, private snackBar: MatSnackBar, @Optional() @Inject(MAT_DIALOG_DATA) public initData: any) { }

  ngOnInit() {
    if (this.initData) {
      for (let mfgLine of this.initData.manufacturinglinestomanage) {
        this.selectedMfgLines.push(mfgLine.manufacturingline);
      }
      this.form.get('analyst').setValue(this.initData.analyst);
      this.form.get('productmanager').setValue(this.initData.productmanager);
      this.form.get('businessmanager').setValue(this.initData.businessmanager);
      this.form.get('admin').setValue(this.initData.admin);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async createUser(): Promise<void> {
    if (this.initData) {
      var mfgLinesToUpload = [];
      for (let mfgLine of this.selectedMfgLines) {
        mfgLinesToUpload.push({
          manufacturingline: mfgLine._id
        });
      }
      console.log("mfgLinesToUpload: ", mfgLinesToUpload);
      var response = await this.restv2.modifyUser(AndVsOr.AND, this.initData.username, this.initData.localuser, null, this.form.get('analyst').value, this.form.get('productmanager').value, this.form.get('businessmanager').value, mfgLinesToUpload, this.form.get('admin').value);
      if (response['ok'] == 1) {
        this.snackBar.open("Successfully modified user permissions.", "close", {
          duration: 2000,
        });
        this.closeDialog();
      } else {
        this.snackBar.open("Error modifying user permissins. Please refresh and try again.", "close", {});
      }

    } else {
      if (this.form.get('username').value && this.form.get('username').value != "" && !this.usernameExists) {
        var mfgLinesToUpload = [];
        for (let mfgLine of this.selectedMfgLines) {
          mfgLinesToUpload.push({
            manufacturingline: mfgLine._id
          });
        }
        console.log("mfgLinesToUpload: ", mfgLinesToUpload);
        var response = await this.restv2.createUser(this.form.get('username').value, this.form.get('password').value, this.form.get('analyst').value, this.form.get('productmanager').value, this.form.get('businessmanager').value, mfgLinesToUpload, this.form.get('admin').value);
        if (response['token']) {
          this.snackBar.open("Successfully created user " + this.form.get('username').value + ".", "close", {
            duration: 2000,
          });
          this.closeDialog();
        } else {
          this.snackBar.open("Error creating user " + this.form.get('username').value + ". Please refresh and try again.", "close", {});
        }
      }
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