import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-user-notification-dialog',
  templateUrl: './user-notification-dialog.component.html',
  styleUrls: ['./user-notification-dialog.component.css']
})
export class UserNotificationDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<UserNotificationDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
