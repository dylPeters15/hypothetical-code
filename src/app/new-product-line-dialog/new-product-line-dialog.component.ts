import { Component, OnInit, Inject } from '@angular/core';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-new-product-line-dialog',
  templateUrl: 'new-product-line-dialog.component.html',
})
export class NewProductLineDialogComponent implements OnInit {
  productlinename;
  constructor(public restv2: RestServiceV2, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<NewProductLineDialogComponent>) { }

  async ngOnInit() {
    console.log(this.data);
    this.productlinename = this.data.productlinename;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  createProductLine() {
    if (this.productlinename && !this.productlinenameError) {
      this.dialogRef.close(this.productlinename);
    }
  }

  productlinenameError = false;
  productlinenameErrorMatcher = {
    isErrorState: (control: FormControl, form: FormGroupDirective): boolean => {
      return this.productlinenameError;
    }
  }
  async productlinenameChanged() {
    if (this.data) {
      if (this.productlinename == this.data.productlinename) {
        this.productlinenameError = false;
        return;
      }
    }
    console.log(this.productlinename);
    var result = await this.restv2.getProductLines(AndVsOr.OR, this.productlinename, null, 1);
    console.log(result);
    if (result.length == 1) {
      this.productlinenameError = true;
      return;
    }
    this.productlinenameError = false;
  }

}