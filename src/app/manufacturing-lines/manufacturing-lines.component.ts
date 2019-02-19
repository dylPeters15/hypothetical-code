import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewLineDialogComponent } from '../new-line-dialog/new-line-dialog.component'
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";
import {ExportToCsv} from 'export-to-csv';

export class ManufacturingLine {
  linename: String;
  shortname: String;
  skus: any = [];
  comment: String;
  checked: boolean;
  constructor(linename, shortname, skus, comment, checked){
    this.linename = linename;
    this.shortname = shortname;
    this.skus = skus;
    this.comment = comment;
    this.checked = checked;
  }
}

export class ExportableLine {
  skus: String;
  linename: String;
  shortname: String;
  comment: String;
  constructor(skus, linename, shortname, comment){
    this.linename = linename;
    this.shortname = shortname;
    this.skus = skus;
    this.comment = comment;
  }
}

@Component({
  selector: 'app-manufacturing-lines',
  templateUrl: './manufacturing-lines.component.html',
  styleUrls: ['./manufacturing-lines.component.css']
})

export class ManufacturingLinesComponent implements OnInit {
  allReplacement = 54321;
  line:any = [];
  displayedColumns: string[] = ['checked', 'linename', 'shortname','skus', 'comment'];
  data: ManufacturingLine[] = [];
  dataSource = new MatTableDataSource<ManufacturingLine>(this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  newDialogRef: MatDialogRef<NewLineDialogComponent>;

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {  }

  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  newLine() {
    const dialogConfig = new MatDialogConfig();
    this.newDialogRef = this.dialog.open(NewLineDialogComponent, dialogConfig);
    this.newDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
  });
}

  ngOnInit() {
    this.refreshData();

  }

  refreshData() {
    this.data = [];
    // this.rest.getline().subscribe(data => {
    //     this.line = data;
    //     var i;
    //     this.dataSource = new MatTableDataSource<ManufacturingGoal>(this.data);
    //     for(i = 0; i<this.line.length; i++){
    //       let name = this.line[i]['name'];
    //       let skus = this.line[i]['skus'];
    //       let quantities = this.line[i]['quantities'];
    //       let date = this.line[i]['date'];
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
        this.data.forEach(line => {
          if (line.checked) {
            this.deleteGoalConfirmed(line.linename);
          }
        });
  }

  deleteGoalConfirmed(name) {
    this.rest.deleteLine(name).subscribe(response => {
      this.snackBar.open("Line: " + name + " deleted successfully.", "close", {
        duration: 2000,
      });
      this.data = this.data.filter((value, index, arr) => {
        return value.linename != name;
      });
      this.refreshData();
    });
  }

  deselectAll() {
    this.data.forEach(line => {
      line.checked = false;
    });
  }

  selectAll() {
    this.data.forEach(line => {
      line.checked = true;
    });
  }

  exportToCsv(goal) {
    // let toExport: ExportableLine[] = [];
    // const options = { 
    //   fieldSeparator: ',',
    //   quoteStrings: '"',
    //   decimalSeparator: '.',
    //   showLabels: true, 
    //   showTitle: true,
    //   title: 'Manufacturing Line',
    //   useTextFile: false,
    //   useBom: true,
    //   headers: ["Name", "Skus", "Quantities", "Date"]
    // };
    // let skuString = goal.skus.toString();
    // let quantityString = goal.quantities.toString();
    
    // let goalToExport = new ExportableGoal(skuString, quantityString, goal.name, goal.date);
    // console.log("Name: " + goalToExport.name + " SKUS: " + goalToExport.skus + " Quants: " + goalToExport.quantities + " Date: " + goalToExport.date);
    // toExport.push(goalToExport);
    // const csvExporter = new ExportToCsv(options);
    // csvExporter.generateCsv(toExport);
  }

}
