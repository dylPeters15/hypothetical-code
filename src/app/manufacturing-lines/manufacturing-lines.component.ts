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
  lines:any = [];
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
    this.rest.getLine('', '.*','','',5).subscribe(data => {
      this.lines = data;
      this.dataSource = new MatTableDataSource<ManufacturingLine>(this.data);
      var i;
      for(i = 0; i<this.lines.length; i++){
        let linename = this.lines[i]['linename'];
        let shortname = this.lines[i]['shortname'];
        var j;
        let skus = '';
        for(j = 0; j<this.lines[i]['skus'].length; j++){
          console.log(this.lines[i]['skus'][j]);
        }
        // let skus = this.lines[i]['skus'];
        let comment = this.lines[i]['comment'];
        let currentLine = new ManufacturingLine(linename, shortname, skus, comment, false);
        this.data.push(currentLine)
      }
      this.data.forEach(element => {
        element['checked'] = false;
      });
      this.dataSource = new MatTableDataSource<ManufacturingLine>(this.data);
      this.dataSource.paginator = this.paginator;
    });
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
