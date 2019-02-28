import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService, AndVsOr } from '../rest.service';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { NewUserDialogComponent } from '../new-user-dialog/new-user-dialog.component';
import { AfterViewChecked } from '@angular/core';
import { PasswordConfirmationDialogComponent } from '../password-confirmation-dialog/password-confirmation-dialog.component';
import { auth } from '../auth.service';
import { ConfirmActionDialogComponent } from '../confirm-action-dialog/confirm-action-dialog.component';
import { UserNotificationDialogComponent } from '../user-notification-dialog/user-notification-dialog.component';
import { Router } from '@angular/router';

export interface UserForTable {
  username: string;
  checked: boolean;
  localuser: boolean;
}


/**
 * @title Table dynamically changing the columns displayed
 */
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(public rest: RestService, private snackBar: MatSnackBar, private dialog: MatDialog, public router: Router) { }
  allReplacement = 54321;
  displayedColumns: string[] = ['checked', 'username', 'admin', 'loginType', 'actions'];
  data: UserForTable[] = [];
  dataSource = new MatTableDataSource<UserForTable>(this.data);
  dialogRef: MatDialogRef<NewUserDialogComponent>;
  passwordDialogRef: MatDialogRef<PasswordConfirmationDialogComponent>;
  confirmDialogRef: MatDialogRef<ConfirmActionDialogComponent>;
  notificationDialogRef: MatDialogRef<UserNotificationDialogComponent>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterQuery: string = "";
  displayAdmins: string = "all";
  displayLocal: string = "all";

  ngOnInit() {
    this.paginator.pageSize = 20;
    this.paginator.page.subscribe(event => {
      this.deselectAll();
    });
    this.refreshData();
  }

  getPageSizeOptions() {
    return [20, 50, 100, this.allReplacement];
  }

  refreshData(filterQueryData?) {
    // filterQueryData = filterQueryData ? "^"+filterQueryData+".*" : "^"+this.filterQuery+".*"; //this returns things that start with the pattern
    filterQueryData = filterQueryData ? ".*"+filterQueryData+".*" : ".*"+this.filterQuery+".*"; //this returns things that have the pattern anywhere in the string
    this.rest.getUsers(AndVsOr.AND, null, filterQueryData, this.displayAdmins=="all"?null:this.displayAdmins=="adminsonly", this.displayLocal=="all"?null:this.displayLocal=="localonly", this.paginator.pageSize*10).then(response => {
      console.log(response);
      this.data = response;
      this.deselectAll();
      this.sortData();
      this.dataSource = new MatTableDataSource<UserForTable>(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    this.dialogRef = this.dialog.open(NewUserDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  sortData() {
    this.data.sort((a, b) => {
      return a.username > b.username ? 1 : -1;
    });
  }

  notifyUser(title, message) {
    const dialogConfig = new MatDialogConfig();
    this.notificationDialogRef = this.dialog.open(UserNotificationDialogComponent, dialogConfig);
    this.notificationDialogRef.componentInstance.title = title;
    this.notificationDialogRef.componentInstance.message = message;
  }

  deleteUserConfirmed(username, localuser) {
    this.rest.deleteUser(AndVsOr.AND, username, localuser).then(response => {
      this.snackBar.open("User " + username + " deleted successfully.", "close", {
        duration: 2000,
      });
      if (username == auth.getUsername()) {
        this.notifyUser("Logging Out", "Your account was deleted and you will be redirected to the login page.");
        this.router.navigate(['logout']);
      }
      this.data = this.data.filter((value, index, arr) => {
        return value.username != username;
      });
      this.refreshData();
    });
  }

  deleteUser(username, localuser) {
    if (auth.getLocal()) {
      const dialogConfig = new MatDialogConfig();
      this.passwordDialogRef = this.dialog.open(PasswordConfirmationDialogComponent, dialogConfig);
      this.passwordDialogRef.afterClosed().subscribe(event => {
        if ((event && event.validated)) {
          this.deleteUserConfirmed(username, localuser);
        }
      });
    } else {
      const dialogConfig = new MatDialogConfig();
      this.confirmDialogRef = this.dialog.open(ConfirmActionDialogComponent, dialogConfig);
      this.confirmDialogRef.afterClosed().subscribe(event => {
        if ((event && event['confirmed'])) {
          this.deleteUserConfirmed(username, localuser);
        }
      });
    }
  }

  newUser() {
    this.openDialog();
  }

  deleteSelected() {
    if (auth.getLocal()) {
      const dialogConfig = new MatDialogConfig();
      this.passwordDialogRef = this.dialog.open(PasswordConfirmationDialogComponent, dialogConfig);
      this.passwordDialogRef.afterClosed().subscribe(event => {
        if ((event && event.validated)) {
          this.data.forEach(user => {
            if (user.checked) {
              this.deleteUserConfirmed(user.username, user.localuser);
            }
          });
        }
      });
    } else {
      const dialogConfig = new MatDialogConfig();
      this.confirmDialogRef = this.dialog.open(ConfirmActionDialogComponent, dialogConfig);
      this.confirmDialogRef.afterClosed().subscribe(event => {
        if ((event && event['confirmed'])) {
          this.data.forEach(user => {
            if (user.checked) {
              this.deleteUserConfirmed(user.username, user.localuser);
            }
          });
        }
      });
    }
  }

  deselectAll() {
    this.data.forEach(user => {
      user.checked = false;
    });
  }

  selectAll() {
    var lowerIndex = this.paginator.pageSize * this.paginator.pageIndex;
    var upperIndex = this.paginator.pageSize * (this.paginator.pageIndex+1);
    if (this.data.length < upperIndex) {
      upperIndex = this.data.length;
    }
    this.deselectAll();
    for (var i = lowerIndex; i < upperIndex; i=i+1) {
      this.data[i].checked = true;
    }
  }

  ngAfterViewChecked() {
    const matOptions = document.querySelectorAll('mat-option');
    // If the replacement element was found...
    if (matOptions) {
      const matOptionsLen = matOptions.length;
      // We'll iterate the array backwards since the allReplacement should be at the end of the array
      for (let i = matOptionsLen - 1; i >= 0; i--) {
        const matOption = matOptions[i];

        // Store the span in a variable for re-use
        const span = matOption.querySelector('span.mat-option-text');
        // If the spans innerHTML string value is the same as the allReplacement variables string value...
        if ('' + span.innerHTML === '' + this.allReplacement) {
          // Change the span text to "All"
          span.innerHTML = 'All';
          break;
        }
      }
    }
  }

  noneSelected(): boolean {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].checked) {
        return false;
      }
    }
    return true;
  }

  changeAdminPriviledge(username, localuser, newPriviledge) {
    this.rest.modifyUser(AndVsOr.AND, username, localuser, null, newPriviledge).then(response => {
      if (response['ok'] != 1) {
        this.snackBar.open("Unable to change user privilege. Please try again later.", "close");
        this.refreshData();
      } else if (username == auth.getUsername()) {
        this.notifyUser("Logging Out", "Your account permission was changed and you will be redirected to the login page.");
        this.router.navigate(['logout']);
      } else if (this.displayAdmins != "all") {
        this.refreshData();
      }
    });
  }

}