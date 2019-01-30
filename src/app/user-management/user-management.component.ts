import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { NewUserDialogComponent } from '../new-user-dialog/new-user-dialog.component';
import { AfterViewChecked } from '@angular/core';
import { PasswordConfirmationDialogComponent } from '../password-confirmation-dialog/password-confirmation-dialog.component';

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

  constructor(public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  allReplacement = 54321;
  displayedColumns: string[] = ['checked', 'username', 'actions'];
  data: UserForTable[] = [];
  dataSource =  new MatTableDataSource<UserForTable>(this.data);
  dialogRef: MatDialogRef<NewUserDialogComponent>;
  passwordDialogRef: MatDialogRef<PasswordConfirmationDialogComponent>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.refreshData();
  }

  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  refreshData() {
    this.rest.sendUserListRequest().subscribe(response => {
      this.data = response['userlist'].filter((value, index, arr) => {
        return value.username != 'admin';
      });
      this.data.forEach(user => {
        user['checked'] = false;
      });
      this.sortData();
      this.dataSource =  new MatTableDataSource<UserForTable>(this.data);
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
    this.data.sort((a,b) => {
      return a.username > b.username ? 1 : -1;
    });
  }

  deleteUserConfirmed(username) {
    this.rest.sendAdminDeleteUserRequest(username).subscribe(response => {
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
    this.data.forEach(user => {
      user.checked = true;
    });
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

}