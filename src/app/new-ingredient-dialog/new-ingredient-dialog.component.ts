import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-ingredient-dialog',
  templateUrl: './new-ingredient-dialog.component.html',
  styleUrls: ['./new-ingredient-dialog.component.css']
})
export class NewIngredientDialogComponent implements OnInit {

  name: string = '';
  number: any = '';
  vendorInformation: string = '';
  packageSize: string = '';
  costPerPackage: number = 0;
  comment: string = ''; 
  id: Number;
  edit: Boolean;
  dialog_title: String;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewIngredientDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.edit = this.data.edit;
    this.name = this.data.name;
    this.number = this.data.number;
    this.vendorInformation = this.data.vendorInformation;
    this.packageSize = this.data.packageSize;
    this.costPerPackage = this.data.costPerPackage;
    this.comment = this.data.comment;
    this.id = this.data.id;

    if (this.edit == true) {
      this.dialog_title = "Modify Ingredient";
    } else this.dialog_title = "Create New Ingredient";
  }

  closeDialog() {
    this.dialogRef.close();
    this.edit = this.data.edit;
    this.name = this.data.name;
    this.number = this.data.number;
    this.vendorInformation = this.data.vendorInformation;
    this.packageSize = this.data.packageSize;
    this.costPerPackage = this.data.costPerPackage;
    this.comment = this.data.comment;
    this.id = this.data.id;
  }

  createIngredient() {
    console.log(this.vendorInformation)
    if (this.edit == false) {
      this.id = Math.floor(Math.random() * 1000000000);
      this.rest.adminCreateIngredient(this.name, this.number, this.vendorInformation, this.packageSize, this.costPerPackage, this.comment, this.id).subscribe(response => {
      if (response['success']) {
        this.snackBar.open("Successfully created ingredient " + this.name + ".", "close", {
          duration: 2000,
        });
        console.log('success')
      } else {
        this.snackBar.open("Error creating ingredient " + this.name + ". Please refresh and try again.", "close", {
          duration: 2000,
        });
        console.log('failure')
      }
      this.closeDialog();
    });
    }
    else {
      this.rest.modifyIngredientRequest(this.name, this.number, this.vendorInformation, this.packageSize, this.costPerPackage, this.comment, this.id).subscribe(response => {
      if (response['success']) {
        this.snackBar.open("Successfully modifying ingredient " + this.name + ".", "close", {
          duration: 2000,
        });
        console.log('success')
      } else {
        this.snackBar.open("Error modifying ingredient " + this.name + ". Please refresh and try again.", "close", {
          duration: 2000,
        });
        console.log('failure')
      }
      this.closeDialog();
    });
    }    
  }
}
