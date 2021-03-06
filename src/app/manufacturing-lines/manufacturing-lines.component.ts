import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewLineDialogComponent } from '../new-line-dialog/new-line-dialog.component'
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource,MatPaginator, MatSnackBar } from "@angular/material";
import {ExportToCsv} from 'export-to-csv';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { auth } from '../auth.service';
import { SkuDetailsComponent } from '../sku-details/sku-details.component';

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
  displayedColumns: string[] = [];
  data: ManufacturingLine[] = [];
  dataSource = new MatTableDataSource<ManufacturingLine>(this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  newDialogRef: MatDialogRef<NewLineDialogComponent>;
  skuDialogRef: MatDialogRef<SkuDetailsComponent>;
  skuString: string = '';
  constructor(public restv2: RestServiceV2,public rest:RestService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {  }
  admin: boolean = false;
  productmanager: boolean = false;

  getPageSizeOptions() {
    return [20, 50, 100, this.allReplacement];
  }

  newLine() {
      this.newManufacturingLine(false, "","", "", "");
}

  ngOnInit() {
    this.refreshData();
    this.admin = auth.isAuthenticatedForAdminOperation();
    this.productmanager = auth.isAuthenticatedForProductManagerOperation();
    if (!this.admin) { //remove "checked" and "actions" columns
      this.displayedColumns.shift();
      this.displayedColumns.pop();
    }
    if(this.productmanager){
      this.displayedColumns = ['linename', 'shortname','skus', 'comment', 'export', 'edit', 'delete'];
    }
    else{
      this.displayedColumns = ['linename', 'shortname','skus', 'comment', 'export'];
    }
  }

  refreshData() {
    this.data = [];
    this.rest.getLine('', '.*','','',5).subscribe(skus => {
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
          this.skuString += this.printSKU(this.lines[i]['skus'][j]['sku']);
          count++;
        }
        this.skuString = this.skuString.substring(0,this.skuString.length-1);
        let comment = this.lines[i]['comment'];
        let currentLine = new ManufacturingLine(linename, shortname, this.skuString, comment, false, count);
        this.data.push(currentLine)
      }
      this.dataSource = new MatTableDataSource<ManufacturingLine>(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteSelected(element) {
    this.deleteGoalConfirmed(element.linename);
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

  printSKU(skuObject){
    let sku = '';
    sku += skuObject['skuname'] + ': ' + skuObject['unitsize'] + ' * ' + skuObject['countpercase'] + ',';
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

  modifySelected(line) {
    this.modifyManufacturingLineConfirmed(line.linename, line.shortname, line.skus, line.comment); 
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
    
  noneSelected(): boolean {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].checked) {
        return false;
      }
    }
    return true;
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

  async showSkuDetails(element){
    let realLine = await this.restv2.getLine(AndVsOr.OR, element['linename'], element['linename'], null,null,1);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {skus: realLine[0]['skus'], name: realLine[0]['shortname']};
    this.skuDialogRef = this.dialog.open(SkuDetailsComponent, dialogConfig);
    this.skuDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

}
