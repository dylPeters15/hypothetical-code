import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { NewUserDialogComponent } from '../new-user-dialog/new-user-dialog.component';
import { AfterViewChecked } from '@angular/core';
import { PasswordConfirmationDialogComponent } from '../password-confirmation-dialog/password-confirmation-dialog.component';
import { auth } from '../auth.service';

export interface UserForTable {
  username: string;
  checked: boolean;
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

  constructor(public rest: RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  allReplacement = 54321;
  displayedColumns: string[] = ['checked', 'username', 'admin', 'loginType', 'actions'];
  data: UserForTable[] = [];
  dataSource = new MatTableDataSource<UserForTable>(this.data);
  dialogRef: MatDialogRef<NewUserDialogComponent>;
  passwordDialogRef: MatDialogRef<PasswordConfirmationDialogComponent>;
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
    this.rest.getUsers("", filterQueryData, this.displayAdmins=="all"?null:this.displayAdmins=="adminsonly", this.displayLocal=="all"?null:this.displayLocal=="localonly", this.paginator.pageSize*10).subscribe(response => {
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

  deleteUserConfirmed(username) {
    this.rest.deleteUser(username).subscribe(response => {
      this.snackBar.open("User " + username + " deleted successfully.", "close", {
        duration: 2000,
      });
      this.data = this.data.filter((value, index, arr) => {
        return value.username != username;
      });
      this.refreshData();
    });
  }

  deleteUser(username) {
    const dialogConfig = new MatDialogConfig();
    this.passwordDialogRef = this.dialog.open(PasswordConfirmationDialogComponent, dialogConfig);
    this.passwordDialogRef.afterClosed().subscribe(event => {
      if (event.validated) {
        this.deleteUserConfirmed(username);
      }
    });
  }

  newUser() {
    this.openDialog();
  }

  deleteSelected() {
    const dialogConfig = new MatDialogConfig();
    this.passwordDialogRef = this.dialog.open(PasswordConfirmationDialogComponent, dialogConfig);
    this.passwordDialogRef.afterClosed().subscribe(event => {
      if (event.validated) {
        this.data.forEach(user => {
          if (user.checked) {
            this.deleteUserConfirmed(user.username);
          }
        });
      }
    });
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
    this.rest.modifyUser(username, localuser, null, newPriviledge).subscribe(response => {
      if (response['ok'] != 1) {
        this.snackBar.open("Unable to change user privilege. Please try again later.", "close");
        this.refreshData();
      } else if (this.displayAdmins != "all") {
        this.refreshData();
      }
    });
  }

}