import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-new-product-line-dialog',
  templateUrl: './new-product-line-dialog.component.html',
  styleUrls: ['./new-product-line-dialog.component.css']
})
export class NewProductLineDialogComponent implements OnInit {

  dialog_title: String;
  edit: Boolean;
  name: String = '';
  sku: String; // Contains Sku IDs for all skus that are part of this product line
  current_id: Number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewProductLineDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.edit = this.data.edit;
    this.name = this.data.present_name;
    this.sku = this.data.present_skus;
    this.current_id = this.data.current_id;

    // edit == true if sku is being modified, false if a new sku is being created
    if (this.edit == true)
    {
      this.dialog_title = "Modify Product Line";
    }
    else this.dialog_title = "Create New Product Line";
  }

  closeDialog() {
    this.dialogRef.close();
    this.edit = this.data.edit;
    this.name = this.data.present_name;
    this.sku = this.data.present_skus;
  }

  convertToId(input_array)
  {
      let sku_array_text: Number[] = [];
      for (var index = 0; index < input_array.length; index++) { 
        // this.rest.getSkuIdFromName(input_array[index]).subscribe(response => {
        //   sku_array_text.push(response.id);
        //   if (sku_array_text.length == input_array.length){
        //     // generate ID
        //     var id = Math.floor(Math.random() * 1000000000);
        //     this.rest.adminCreateProductLine(this.name, sku_array_text, id).subscribe(response => {
        //       //let i;
        //       //for (i=0; i<this.sku.length-1; i = i++) {
        //       //  this.sku[i]
        //       //  this.addIngredient(this.ingredients[i], this.name);
        //      // }
        //       if (response['success']) {
        //         this.snackBar.open("Successfully created product line " + this.name + ".", "close", {
        //           duration: 2000,
        //         });
        //       } else {
        //         this.snackBar.open("Error creating product line " + this.name + ". Please refresh and try again.", "close", {
        //           duration: 2000,
        //         });
        //       }
        //       this.closeDialog();
        //     });
        //   }
        //   });
          }
      }
  

  createProductLine() {
    if (this.edit == false)
    {
      var sku_array = this.sku.split(',');
      let sku_array_text: Number[] = [];
      this.convertToId(sku_array);
    }
      
    else{
      console.log("We're modifying a product line");
      // this.rest.modifyProductLineRequest(this.name, this.sku, this.current_id).subscribe(response => {
      //  // let i;
      //  // for (i=0; i<this.ingredients.length-1; i = i+2) {
      //  //   this.addIngredient(this.ingredients[i], this.name);
      //  // }
      //   if (response['success']) {
      //     this.snackBar.open("Successfully modifyed product line " + this.name + ".", "close", {
      //       duration: 2000,
      //     });
      //   } else {
      //     this.snackBar.open("Error modifying product line " + this.name + ". Please refresh and try again.", "close", {
      //       duration: 2000,
      //     });
      //   }
      //   this.closeDialog();
      // });
    }
  }

  //updateProductLine(name, sku) {
  //    this.rest.addProductLine(sku, name).subscribe(response => {
  //      console.log("New ingredient data", response)
  //    });
  //  });
 // }
    // console.log("new skus", this.newSkus)
  //   this.newSkus.push(sku);
  //   console.log("new skus", this.newSkus)
  //   this.rest.addIngredientSku(ingredient, this.newSkus).subscribe(response =>
  //     console.log("New ingredient data", response));
  // }

}
