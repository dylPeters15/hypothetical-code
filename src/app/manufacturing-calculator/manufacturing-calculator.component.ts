import { Component, OnInit,ViewChild, ElementRef, Inject  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ExportToCsv} from 'export-to-csv';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
export class SkuQuantityTable{
  ingredientName: any;
  packages: any;
  packagesMeasured: any;
  constructor(ingredientName,packages, packagesMeasured){
    this.ingredientName = ingredientName;
    this.packages = packages;
    this.packagesMeasured = packagesMeasured;
  }
}

@Component({
  selector: 'app-manufacturing-calculator',
  templateUrl: './manufacturing-calculator.component.html',
  styleUrls: ['./manufacturing-calculator.component.css']
})

export class ManufacturingCalculatorComponent implements OnInit {
  allReplacement = 54321;
  goal: any;
  username: string;
  displayedColumns: string[] = ['ingredientName', 'packages', 'packagesMeasured'];
  dataForTable: SkuQuantityTable[] = [];
  ingredients: string[] = [];
  dataForTableSource = new MatTableDataSource<SkuQuantityTable>(this.dataForTable);
  showDetails:boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<ManufacturingCalculatorComponent>, public rest:RestService, private route: ActivatedRoute, private router: Router) { }


  getPageSizeOptions() {
    return [20, 50, 100, this.allReplacement];
  }

  ngOnInit() {
    this.goal = this.data.goal[0];
    console.log(JSON.stringify(this.goal))
    this.calculateIngredientsAndQuantities(this.goal['activities'])
  }



  calculateIngredientsAndQuantities(activitiesList) {
    var i;
    for(i = 0; i<activitiesList.length; i++){
      let activityQuantity = activitiesList[i]['activity']['numcases'];
      let ingredientsandquanties = activitiesList[i]['activity']['sku']['formula']['ingredientsandquantities'];
      let scaleFactor = activitiesList[i]['activity']['sku']['formulascalingfactor'];
      var j;
      for(j = 0; j<ingredientsandquanties.length; j++){
        this.addToDataSource(ingredientsandquanties[j]['ingredient'], activityQuantity, scaleFactor, ingredientsandquanties[j]['quantity'])
      }
    }
  }

  addToDataSource(ingredient, numCases, formulaScaleFactor, ingredientQuantity){
    console.log("ING: " + JSON.stringify(ingredient))
      let name = ingredient['ingredientname'];
      let packagesMeasured = Math.round(100*numCases * formulaScaleFactor * ingredient['amount'])/100; ;
      let packages = Math.round(100*(packagesMeasured/ingredientQuantity))/100;
      let packagesMeasuredString = packagesMeasured + " " + ingredient['unitofmeasure']
      if(this.ingredients.indexOf(name) == -1){
        this.ingredients.push(name);
        let newIngredient = new SkuQuantityTable(name, packages, packagesMeasuredString);
        this.dataForTable.push(newIngredient);
      }
      else{
        var i;
        for(i = 0; i< this.dataForTable.length; i++){
          if(this.dataForTable[i].ingredientName == name){
            let ingredientToUpdate = this.dataForTable[i];
            ingredientToUpdate.packages +=  packages;
            let oldMeasured = Number(ingredientToUpdate.packagesMeasured.substring(0,ingredientToUpdate.packagesMeasured.indexOf(" ")))
            let updatedPackagesMeasured = oldMeasured + packagesMeasured;
            ingredientToUpdate.packagesMeasured = updatedPackagesMeasured + " " + ingredient['unitofmeasure']
            this.dataForTable.splice(i,1);
            this.dataForTable.push(ingredientToUpdate)
          }
        }
      }
      console.log(this.dataForTable)
      this.dataForTableSource = new MatTableDataSource<SkuQuantityTable>(this.dataForTable);
      this.dataForTableSource.paginator = this.paginator;
    }

    closeDialog() {
      this.dialogRef.close();
      this.goal = null;
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
      headers: ["Ingredient", "Packages", "Packages (with Units)"]
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.dataForTable);
  }

}
