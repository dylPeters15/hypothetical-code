import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'app-confirm-deletion-dialog',
  templateUrl: './confirm-deletion-dialog.component.html',
  styleUrls: ['./confirm-deletion-dialog.component.css']
})
export class ConfirmDeletionDialogComponent implements OnInit {
  
  public title: string = "Confirm Deletion";
  public message: string = "Are you sure you want to perform this action?";

  ingredient: string;
  affectedFormulaNames: [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ConfirmDeletionDialogComponent>) { }

  ngOnInit() {
      this.ingredient = this.data.ingredient;
      this.affectedFormulaNames = this.data.affectedFormulaNames
  }

  cancel() {
    this.dialogRef.close({confirmed:false});
  }

  confirm() {
    this.dialogRef.close({confirmed:true});
  }

}