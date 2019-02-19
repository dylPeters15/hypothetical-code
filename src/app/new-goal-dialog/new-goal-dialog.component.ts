import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-new-goal-dialog',
  templateUrl: './new-goal-dialog.component.html',
  styleUrls: ['./new-goal-dialog.component.css']
})
export class NewGoalDialogComponent implements OnInit {

  name: string = '';
  skus: any = [];
  quantities: any = [];
  date: string = '';
  constructor(private dialogRef: MatDialogRef<NewGoalDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
    this.name = '';
    this.skus = [];
    this.quantities = [];
    this.date = '';
  }

  createGoal() {
    // this.rest.createGoal(this.name, this.skus, this.quantities, this.date).subscribe(response => {
    //   if (response['success']) {
    //     this.snackBar.open("Successfully created Goal: " + this.name + ".", "close", {
    //       duration: 2000,
    //     });
    //   } else {
    //     this.snackBar.open("Error creating Goal: " + this.name + ". Please refresh and try again.", "close", {
    //       duration: 2000,
    //     });
    //   }
    //   this.closeDialog();
    // });
  }
}