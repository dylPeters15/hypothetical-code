import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from "@angular/material";
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-more-info-dialog',
  templateUrl: './more-info-dialog.component.html',
  styleUrls: ['./more-info-dialog.component.css']
})
export class MoreInfoDialogComponent implements OnInit {

  username: string = '';
  password: string = 'password';
  hidePassword: boolean = false;
  passed_data: string = '';
  information_content: Array<Number>;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<MoreInfoDialogComponent>, public rest:RestService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.information_content = this.data.information_content;
  }

  closeDialog() {
    this.dialogRef.close();
    this.username = '';
    this.password = 'password';
  }
}
