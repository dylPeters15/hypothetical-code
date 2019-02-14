import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-record-compare-dialog',
  templateUrl: './record-compare-dialog.component.html',
  styleUrls: ['./record-compare-dialog.component.css']
})
export class RecordCompareDialogComponent implements OnInit {

  applyToAll: boolean = false;
  public oldData: string = "";
  public newData: string = "";

  constructor(private dialogRef: MatDialogRef<RecordCompareDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog(useNew) {
    this.dialogRef.close({
      useNew: useNew,
      applyToAll: this.applyToAll
    });
  }

}
