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
  skus: String;
  skuCount: number;
  comment: String;
  checked: boolean;
  constructor(linename, shortname, skus, comment, checked, skuCount){
    this.skuCount = skuCount;
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
  displayedColumns: string[] = ['checked', 'linename', 'shortname','skus', 'comment', 'export'];
  data: ManufacturingLine[] = [];
  dataSource = new MatTableDataSource<ManufacturingLine>(this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  newDialogRef: MatDialogRef<NewLineDialogComponent>;
  skuString: string = '';
  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {  }

  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  newLine() {
      this.newManufacturingLine(false, "","", "", "");
}

  ngOnInit() {
    this.refreshData();

  }

  refreshData() {
    this.data = [];
    this.rest.getLine('', '.*','','',5).subscribe(skus => {
      console.log("DATA: " + JSON.stringify(skus))
      this.lines = skus;
      this.dataSource = new MatTableDataSource<ManufacturingLine>(this.data);
      var i;
      for(i = 0; i<this.lines.length; i++){
        this.skuString = "";
        let linename = this.lines[i]['linename'];
        let shortname = this.lines[i]['shortname'];
        var count = 0;
        var j;
        for(j = 0; j<this.lines[i]['skus'].length; j++){
          this.skuString += this.printSKU(this.lines[i]['skus'][j]['sku']) + '\n';
          console.log("String: " + this.skuString)
          count++;
        }
        let comment = this.lines[i]['comment'];
        let currentLine = new ManufacturingLine(linename, shortname, this.skuString, comment, false, count);
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
      this.skuString = "";
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

  printSKU(skuObject){
    let sku = '';
    sku += '<' + skuObject['skuname'] + '>: <' + skuObject['unitsize'] + '> * <' + skuObject['countpercase'] + '>';
    return sku;
}

  exportToCsv(line) {
    let toExport: ExportableLine[] = [];
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: false,
      title: 'Manufacturing Line',
      useTextFile: false,
      useBom: true,
      headers: ["Linename", "Shortname", "SKUs", "Comment"]
    };
    
    let lineToExport = new ExportableLine(line.skus, line.linename, line.shortname, line.comment);
    toExport.push(lineToExport);
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(toExport);
  }

  modifySelected() {
    const dialogConfig = new MatDialogConfig();
    let counter: number = 0;
    this.data.forEach(line => {
      if (line.checked) {
        counter++;
      }
    });
    if (counter == 0) 
    {
      this.snackBar.open("Please select a manufacturing line to modify", "close", {
        duration: 2000,
      });
    }
    else if (counter != 1) 
    {
      this.snackBar.open("Please only select one promanufacturingduct line to modify", "close", {
        duration: 2000,
      });
    }
    else{
        this.data.forEach(line => {
          if (line.checked) {
            this.modifyManufacturingLineConfirmed(line.linename, line.shortname, line.skus, line.comment);
          }
        });
      } 
      
    }

    modifyManufacturingLineConfirmed(present_linename, present_shortname, present_skus, present_comment) {
      this.newManufacturingLine(true, present_linename, present_shortname, present_skus, present_comment);
    }

    newManufacturingLine(edit, present_linename, present_shortname, present_skus, present_comment) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {edit: edit, present_linename: present_linename, present_shortname: present_shortname, present_skus:present_skus,present_comment:present_comment };
      this.newDialogRef = this.dialog.open(NewLineDialogComponent, dialogConfig);
      this.newDialogRef.afterClosed().subscribe(event => {
        this.refreshData();
      });
    }

}
