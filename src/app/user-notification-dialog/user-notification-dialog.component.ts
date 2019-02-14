import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-user-notification-dialog',
  templateUrl: './user-notification-dialog.component.html',
  styleUrls: ['./user-notification-dialog.component.css']
})
export class UserNotificationDialogComponent implements OnInit {

  public title: string = "Title";
  public message: string = "message";

  constructor(private dialogRef: MatDialogRef<UserNotificationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data) {
      if (this.data['title']) {
        this.title = this.data['title'];
      }
      if (this.data['message']) {
        this.message = this.data['message'];
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
