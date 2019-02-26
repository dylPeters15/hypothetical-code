import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ExportToCsv} from 'export-to-csv';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";

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
  goals: any = [];
  selectedGoal: any;
  username: string;
  displayedColumns: string[] = ['ingredientName', 'packages', 'packagesMeasured'];
  data: SkuQuantityTable[] = [];
  ingredients: string[] = [];
  dataSource = new MatTableDataSource<SkuQuantityTable>(this.data);
  showDetails:boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }


  getPageSizeOptions() {
    return [20, 50, 100, this.allReplacement];
  }

  ngOnInit() {
    this.rest.getUserName().then(result => {
      this.username = result.toString();
      this.rest.getGoals(this.username, "", ".*", false, 5).subscribe(data => {
          this.goals = data;
          
      })
    })
  }

  getGoalByName(name) {
    this.showDetails = true;
    this.data = [];
    this.ingredients = [];
    this.dataSource = new MatTableDataSource<SkuQuantityTable>(this.data);
      this.rest.getGoals(this.username, name, name, false, 5).subscribe(data => {
          this.selectedGoal = data[0];
          console.log("GOAL: " + JSON.stringify(data[0]))
          let skus: String[] = [];
          let activities = this.selectedGoal['activities'];
          this.calculateIngredientsAndQuantities(activities)
    
        });
    }

  calculateIngredientsAndQuantities(activitiesList) {
    var i;
    for(i = 0; i<activitiesList.length; i++){
      let activityQuantity = activitiesList[i]['activity']['numcases'];
      let ingredientsandquanties = activitiesList[i]['activity']['sku']['formula']['ingredientsandquantities'];
      let scaleFactor = activitiesList[i]['activity']['sku']['formulascalingfactor'];
      var j;
      for(j = 0; j<ingredientsandquanties.length; j++){
        this.addToDataSource(ingredientsandquanties[j]['ingredient'], activityQuantity, scaleFactor)
      }
    }
  }

  addToDataSource(ingredient, numCases, formulaScaleFactor){
    console.log("ING: " + JSON.stringify(ingredient))
      let name = ingredient['ingredientname'];
      let packages = numCases * formulaScaleFactor;
      let packagesMeasured = numCases * formulaScaleFactor * ingredient['amount'];
      let packagesMeasuredString = packagesMeasured + " " + ingredient['unitofmeasure']
      if(this.ingredients.indexOf(name) == -1){
        this.ingredients.push(name);
        let newIngredient = new SkuQuantityTable(name, packages, packagesMeasuredString);
        this.data.push(newIngredient);
      }
      else{
        var i;
        for(i = 0; i< this.data.length; i++){
          if(this.data[i].ingredientName == name){
            let ingredientToUpdate = this.data[i];
            ingredientToUpdate.packages +=  packages;
            let oldMeasured = Number(ingredientToUpdate.packagesMeasured.substring(0,ingredientToUpdate.packagesMeasured.indexOf(" ")))
            let updatedPackagesMeasured = oldMeasured + packagesMeasured;
            ingredientToUpdate.packagesMeasured = updatedPackagesMeasured + " " + ingredient['unitofmeasure']
            this.data.splice(i,1);
            this.data.push(ingredientToUpdate)
          }
        }
      }
      this.dataSource = new MatTableDataSource<SkuQuantityTable>(this.data);
      this.dataSource.paginator = this.paginator;
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
    csvExporter.generateCsv(this.data);
  }

}
