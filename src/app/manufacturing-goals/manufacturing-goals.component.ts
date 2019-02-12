import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewGoalDialogComponent } from '../new-goal-dialog/new-goal-dialog.component'
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";
import {ExportToCsv} from 'export-to-csv';

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

export class ExportableGoal {
  skus: String;
  quantities: String;
  name: String;
  date: String;
  constructor(skus, quantities, name, date){
    this.name = name;
    this.skus = skus;
    this.quantities = quantities;
    this.date = date;
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
  displayedColumns: string[] = ['checked', 'name', 'skus','quantities', 'date', 'export'];
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
    // this.rest.getGoals().subscribe(data => {
    //     this.goals = data;
    //     var i;
    //     this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
    //     for(i = 0; i<this.goals.length; i++){
    //       let name = this.goals[i]['name'];
    //       let skus = this.goals[i]['skus'];
    //       let quantities = this.goals[i]['quantities'];
    //       let date = this.goals[i]['date'];
    //       let currentGoal = new ManufacturingGoal(name, skus, quantities, date, false);
    //       this.data.push(currentGoal);
    //     }
    //     this.data.forEach(element => {
    //       element['checked'] = false;
    //     });
    //     this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
    //     this.dataSource.paginator = this.paginator;
    // })
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
    // this.rest.sendDeleteGoalRequest(name).subscribe(response => {
    //   this.snackBar.open("Goal: " + name + " deleted successfully.", "close", {
    //     duration: 2000,
    //   });
    //   this.data = this.data.filter((value, index, arr) => {
    //     return value.name != name;
    //   });
    //   this.refreshData();
    // });
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

  exportToCsv(goal) {
    let toExport: ExportableGoal[] = [];
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'Manufacturing Goal',
      useTextFile: false,
      useBom: true,
      headers: ["Name", "Skus", "Quantities", "Date"]
    };
    let skuString = goal.skus.toString();
    let quantityString = goal.quantities.toString();
    
    let goalToExport = new ExportableGoal(skuString, quantityString, goal.name, goal.date);
    console.log("Name: " + goalToExport.name + " SKUS: " + goalToExport.skus + " Quants: " + goalToExport.quantities + " Date: " + goalToExport.date);
    toExport.push(goalToExport);
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(toExport);
  }

}
