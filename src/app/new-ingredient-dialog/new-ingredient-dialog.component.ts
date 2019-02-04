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
  number: any = -1;
  vendor_information: string = '';
  package_size: string = '';
  cost_per_package: any = -1;
  comment: string = '';

  constructor(private dialogRef: MatDialogRef<NewIngredientDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
    this.name = '';
    this.number = -1;
    this.vendor_information = '';
    this.package_size = '';
    this.cost_per_package = -1;
    this.comment = '';
  }

  createIngredient() {
    console.log("well we got here...");
    this.rest.adminCreateIngredient(this.name, this.number, this.vendor_information, this.package_size, this.cost_per_package, this.comment).subscribe(response => {
      if (response['success']) {
        this.snackBar.open("Successfully created ingredient " + this.name + ".", "close", {
          duration: 2000,
        });
      } else {
        this.snackBar.open("Error creating ingredient " + this.name + ". Please refresh and try again.", "close", {
          duration: 2000,
        });
      }
      this.closeDialog();
    });
  }

}
