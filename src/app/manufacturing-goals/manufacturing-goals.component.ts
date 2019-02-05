import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewGoalDialogComponent } from '../new-goal-dialog/new-goal-dialog.component'
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";

export class ManufacturingGoal {
  skus: any = [];
  quantities: any = [];
  name: String;
  date: String;
  checked: boolean;
  constructor(name, skus, quantities, date, checked){
    this.name = name;
    this.skus = skus;
    this.quantities = quantities;
    this.date = date;
    this.checked = checked;
  }
}

@Component({
  selector: 'app-manufacturing-goals',
  templateUrl: './manufacturing-goals.component.html',
  styleUrls: ['./manufacturing-goals.component.css']
})

export class ManufacturingGoalsComponent implements OnInit {
  allReplacement = 54321;
  goals:any = [];
  displayedColumns: string[] = ['checked', 'name', 'skus','quantities', 'date'];
  data: ManufacturingGoal[] = [];
  dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  newDialogRef: MatDialogRef<NewGoalDialogComponent>;

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {  }

  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  newGoal() {
    const dialogConfig = new MatDialogConfig();
    this.newDialogRef = this.dialog.open(NewGoalDialogComponent, dialogConfig);
    this.newDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
  });
}

  ngOnInit() {
    this.refreshData();

  }

  refreshData() {
    this.data = [];
    this.rest.getGoals().subscribe(data => {
        this.goals = data;
        var i;
        this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
        for(i = 0; i<this.goals.length; i++){
          let name = this.goals[i]['name'];
          let skus = this.goals[i]['skus'];
          let quantities = this.goals[i]['quantities'];
          let date = this.goals[i]['date'];
          let currentGoal = new ManufacturingGoal(name, skus, quantities, date, false);
          this.data.push(currentGoal);
        }
        this.data.forEach(element => {
          element['checked'] = false;
        });
        this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
        this.dataSource.paginator = this.paginator;
    })
  }

  deleteSelected() {
    const dialogConfig = new MatDialogConfig();
        this.data.forEach(goal => {
          if (goal.checked) {
            this.deleteGoalConfirmed(goal.name);
          }
        });
  }

  deleteGoalConfirmed(name) {
    this.rest.sendDeleteGoalRequest(name).subscribe(response => {
      this.snackBar.open("Goal: " + name + " deleted successfully.", "close", {
        duration: 2000,
      });
      this.data = this.data.filter((value, index, arr) => {
        return value.name != name;
      });
      this.refreshData();
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
