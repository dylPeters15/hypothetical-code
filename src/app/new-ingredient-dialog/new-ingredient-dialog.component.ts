import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-new-ingredient-dialog',
  templateUrl: './new-ingredient-dialog.component.html',
  styleUrls: ['./new-ingredient-dialog.component.css']
})
export class NewIngredientDialogComponent implements OnInit {

  name: string = '';
  number: any = '';
  vendor_information: string = '';
  package_size: string = '';
  cost_per_package: any = '';
  comment: string = '';

  constructor(private dialogRef: MatDialogRef<NewIngredientDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
    this.name = '';
    this.number = '';
    this.vendor_information = '';
    this.package_size = '';
    this.cost_per_package = '';
    this.comment = '';
  }

  createIngredient() {
    console.log("well we got here...");
    this.rest.adminCreateIngredient(this.name, this.number, this.vendor_information, this.package_size, this.cost_per_package, this.comment).subscribe(response => {
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

}
