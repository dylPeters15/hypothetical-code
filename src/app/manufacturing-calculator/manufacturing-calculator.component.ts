import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
//import {ExportToCsv} from 'export-to-csv';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";

export class SkuQuantityTable{
  sku: any;
  quantity: any;
  constructor(sku,quantity){
    this.sku = sku;
    this.quantity = quantity;
  }
}

@Component({
  selector: 'app-manufacturing-calculator',
  templateUrl: './manufacturing-calculator.component.html',
  styleUrls: ['./manufacturing-calculator.component.css']
})
//TODO: Integrate with SKU and Ingredient database to get ingredient name/list from SKU
export class ManufacturingCalculatorComponent implements OnInit {
  allReplacement = 54321;
  goals: any = [];
  selectedGoal: any;
  displayedColumns: string[] = ['sku', 'quantity'];
  data: SkuQuantityTable[] = [];
  dataSource = new MatTableDataSource<SkuQuantityTable>(this.data);
  showDetails:boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }


  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  ngOnInit() {
  this.rest.getGoals().subscribe(data => {
    this.goals = data;
  });
  }

  getGoalByName(name) {
    this.showDetails = true;
    this.data = [];
    this.dataSource = new MatTableDataSource<SkuQuantityTable>(this.data);
    this.rest.getGoalByName(name).subscribe(data => {
      this.selectedGoal = data;
      let skus = this.selectedGoal['skus'];
      let quantities = this.selectedGoal['quantities'];
      var i;
      for(i = 0; i< skus.length; i++){
        let currentSKU = skus[i];
        let currentQuantity = quantities[i]; //TODO: connect this to ingredients
        let currentEntry = new SkuQuantityTable(currentSKU, currentQuantity);
        this.data.push(currentEntry);
      }
      this.dataSource = new MatTableDataSource<SkuQuantityTable>(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  exportToCsv() {
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'Calculation Result',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    //const csvExporter = new ExportToCsv(options);
    //csvExporter.generateCsv(this.data);
  }

}
