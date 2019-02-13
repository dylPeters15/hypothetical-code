import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ExportToCsv} from 'export-to-csv';
import { MatDialogRef, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";

export class SkuQuantityTable{
  ingredientName: any;
  quantity: any;
  constructor(ingredientName,quantity){
    this.ingredientName = ingredientName;
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
  displayedColumns: string[] = ['ingredientName', 'quantity'];
  data: SkuQuantityTable[] = [];
  ingredients: string[] = [];
  dataSource = new MatTableDataSource<SkuQuantityTable>(this.data);
  showDetails:boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }


  getPageSizeOptions() {
    return [5, 10, 20, this.allReplacement];
  }

  ngOnInit() {
  // this.rest.getGoals().subscribe(data => {
  //   this.goals = data;
  // });
  }

  getGoalByName(name) {
    this.showDetails = true;
    this.data = [];
    this.ingredients = [];
    this.dataSource = new MatTableDataSource<SkuQuantityTable>(this.data);
    // this.rest.getGoalByName(name).subscribe(data => {
    //   this.selectedGoal = data;
    //   let skus = this.selectedGoal['skus'];
    //   let quantities = this.selectedGoal['quantities'];
    //   var i;
    //   for(i = 0; i< skus.length; i++){
    //     let currentSKU = skus[i];
    //     let currentQuantity = quantities[i];
    //     this.calculateIngredientsAndQuantities(currentSKU, currentQuantity);
    //   }
    // });
  }

  calculateIngredientsAndQuantities(SKU, goalQuantity) {
    console.log("SKU: " + SKU  + " Quantity: " + goalQuantity);
    // this.rest.getSkus().subscribe(data => {
    //   console.log("SKUS: " + data);
    //   let skus = data;
    //   for(i = 0; i< skus.length; i++){
    //     let currentSKU = skus[i];
    //     if(currentSKU['skuNumber'] == SKU){
    //       let ingredientsFromDatabase = currentSKU['ingredientTuples'];
    //       var i;
    //       for(i = 0; i<ingredientsFromDatabase.length-1; i +=2){
    //         this.addToDataSource(ingredientsFromDatabase[i].toString(), ingredientsFromDatabase[i+1], goalQuantity);
    //       }
    //     }
    //   }
      
    // });
  }

  addToDataSource(ingredientId, ingredientQuantity, goalQuantity){
    // this.rest.getIngredientById(ingredientId).subscribe(data => {
    //   let ingredient = data;
    //   let name = ingredient.name;
    //   let actualQuantity = ingredientQuantity * goalQuantity;
    //   // if(this.ingredients.contains(name)){
    //   //   this.updateIngredient(name, actualQuantity);
    //   // }
    //   // else {
    //     this.ingredients.push(name);
    //     let newIngredientPair = new SkuQuantityTable(name, actualQuantity);
    //     this.data.push(newIngredientPair);
    //   this.dataSource = new MatTableDataSource<SkuQuantityTable>(this.data);
    //   this.dataSource.paginator = this.paginator;
    //   // }
    // });
  }

  updateIngredient(ingredientName, additionalQuantity){
    var i;
    for(i = 0; i<this.data.length; i++){
      if(this.data[i].ingredientName == ingredientName){
        let oldQuantity = this.data[i].quantity;
        this.data.splice(i,i);
        let newQuantity = oldQuantity + additionalQuantity;
        let newPair = new SkuQuantityTable(name, newQuantity);
        this.data.push(newPair);
      }
    }
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
      headers: ["Ingredient", "Quantity (Packages)"]
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.data);
  }

}
