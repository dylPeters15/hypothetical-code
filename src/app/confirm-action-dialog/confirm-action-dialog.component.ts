import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-confirm-action-dialog',
  templateUrl: './confirm-action-dialog.component.html',
  styleUrls: ['./confirm-action-dialog.component.css']
})
export class ConfirmActionDialogComponent implements OnInit {
  
  public title: string = "Confirm Action";
  public message: string = "Are you sure you want to perform this action?";

  constructor(private dialogRef: MatDialogRef<ConfirmActionDialogComponent>) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close({confirmed:false});
  }

  confirm() {
    this.dialogRef.close({confirmed:true});
  }

}
