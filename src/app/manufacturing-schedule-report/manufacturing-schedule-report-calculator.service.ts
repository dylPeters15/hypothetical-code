import { Injectable } from '@angular/core';
import { RestService } from '../rest.service';
var moment = require('moment');     //please note that you should include moment library first
require('moment-weekday-calc');

@Injectable({
  providedIn: 'root'
})
export class ManufacturingScheduleReportCalculatorService {

  constructor(public rest: RestService) { }

  getActivities(selectedLine: string, startDate: Date, endDate: Date): Promise<any> {
    return new Promise((resolve, reject) => {
      // this.rest.getActivities(startDate, 100).subscribe(response => {
      //   console.log(response);
      //   var data = response.filter((value, index, array) => {
      //     return value['line'] && value['line']['linename'] == selectedLine;
      //   });
      //   console.log("Table data: ", data);
      //   data.forEach(element => {
      //     element['sethours'] = element['sethours'] || element['calculatedhours'];
      //     element['startdate'] = new Date(element['startdate']);
      //     element['enddate'] = this.calculateEndDate(new Date(element['startdate']), element['sethours']);
      //   });
      //   data = data.filter((value, index, array) => {
      //     return value['enddate'] <= endDate;
      //   });
      //   data.forEach(element => {
      //     element['startdate'] = element['startdate'].getMonth()+1 + '/' + element['startdate'].getDate() + '/' + element['startdate'].getFullYear();
      //     element['enddate'] = element['enddate'].getMonth()+1 + '/' + element['enddate'].getDate() + '/' + element['enddate'].getFullYear();
      //   });
      //   resolve(data);
      // });
    });
  }

  getIngredients(selectedLine: string, startDate: Date, endDate: Date): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getActivities(selectedLine, startDate, endDate).then(activities => {
        var ingredients: Map<string, any> = new Map();
        var unitsOfMeasure: Map<string, string> = new Map();
        for (let activity of activities) {
          for (let ingredientAndQuantity of activity['sku']['formula']['ingredientsandquantities']) {
            var value = {
              numCases: ingredientAndQuantity['quantity'] * activity['sku']['formulascalingfactor'] * activity['numcases'],
              quantity: ingredientAndQuantity['quantity'] * activity['sku']['formulascalingfactor'] * activity['numcases'] * ingredientAndQuantity['ingredient']['amount'],
              ingredientName: ingredientAndQuantity['ingredient']['ingredientname'],
              ingredientNumber: ingredientAndQuantity['ingredient']['ingredientnumber']
            };
            if (ingredients.has(ingredientAndQuantity['ingredient']['ingredientname'])) {
              ingredients.set(ingredientAndQuantity['ingredient']['ingredientname'], {
                numCases: ingredients.get(ingredientAndQuantity['ingredient']['ingredientname'])['numCases']+value['numCases'],
                quantity: ingredients.get(ingredientAndQuantity['ingredient']['ingredientname'])['quantity']+value['quantity'],
                ingredientName: ingredientAndQuantity['ingredient']['ingredientname'],
                ingredientNumber: ingredientAndQuantity['ingredient']['ingredientnumber']
              });
            } else {
              ingredients.set(ingredientAndQuantity['ingredient']['ingredientname'], value);
            }
            unitsOfMeasure.set(ingredientAndQuantity['ingredient']['ingredientname'], ingredientAndQuantity['ingredient']['unitofmeasure']);
          }
        }
        console.log(ingredients);
        console.log(unitsOfMeasure);

        var tableData: any[] = [];
        for (let ingredientName of Array.from(ingredients.keys())) {
          tableData.push({
            ingredientNumber: ingredients.get(ingredientName)['ingredientNumber'],
            ingredientName: ingredientName,
            numCases: ingredients.get(ingredientName)['numCases'],
            quantity: ingredients.get(ingredientName)['quantity'] + " " + unitsOfMeasure.get(ingredientName)
          });
        }
        console.log("Ingredient table data: ",tableData);
        resolve(tableData);
      });
    });
  }

  calculateEndDate(startDate: Date, hours: Number): Date {
    var endDate = new Date(startDate);
    const NUM_HOURS_PER_DAY = 10;
    while (moment().isoWeekdayCalc([startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDay()], [endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDay()], [2, 3, 4, 5, 6]) * NUM_HOURS_PER_DAY < hours) {
      endDate.setDate(endDate.getDate() + 1);
    }
    return endDate;
  }

}
