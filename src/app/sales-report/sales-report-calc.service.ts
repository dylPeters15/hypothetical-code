import { Injectable } from '@angular/core';
import { RestServiceV2, AndVsOr } from '../restv2.service';

@Injectable({
  providedIn: 'root'
})
export class SalesReportCalcService {

  constructor(public restv2: RestServiceV2) { }

  summarizeSales(allSales: any[], sku: any): any[] {
    var currentDate: Date = new Date();
    var currentYear: Number = currentDate.getFullYear();

    var salesByYear = {};
    for (let sale of allSales) {
      var dateOfSale: Date = new Date(sale['date']);
      var yearOfSale = dateOfSale.getFullYear();
      if (!salesByYear[yearOfSale]){
        salesByYear[yearOfSale] = [];
      }
      salesByYear[yearOfSale].push(sale);
    }
    var summarized = [];
    for (let year of Object.keys(salesByYear)) {
      summarized.push(this.summarizeYear(year, salesByYear[year], sku));
    }
    summarized = summarized.filter((value,index,array) => {
      return Number(value['year']) >= Number(currentYear) - 10;
    });
    return summarized;
  }

  async summarizeTotal(allSales: any[], sku: any): Promise<any[]> {
    var summary = {};

    var revenueSum = 0;
    var caseSum = 0;
    for (var sale of allSales) {
      revenueSum += sale['numcases'] * sale['pricepercase'];
      caseSum += sale['numcases'];
    }
    summary['revenuesum'] = revenueSum;
    summary['averagerevenuepercase'] = revenueSum/caseSum;

    summary['averagemanufacturingrunsize'] = await this.avgManufacturingRunSize(sku);
    summary['ingredientcostpercase'] = this.ingredientCostPerCase(sku);
    summary['averagemanufacturingsetupcostpercase'] = sku['manufacturingsetupcost']/summary['averagemanufacturingrunsize'];
    summary['manufacturingruncostpercase'] = sku['manufacturingruncost']/summary['averagemanufacturingrunsize'];
    summary['totalcogspercase'] = summary['ingredientcostpercase'] + summary['averagemanufacturingsetupcostpercase'] + summary['manufacturingruncostpercase'];
    summary['averageprofitpercase'] = summary['averagerevenuepercase'] - summary['totalcogspercase'];
    summary['profitmargin'] = summary['averagerevenuepercase']/summary['totalcogspercase'] - 1;
    
    return [summary];
  }

  ingredientCostPerCase(sku: any): Number {
    var totalCost = 0;
    for (let ingredientandquantity of sku['formula']['ingredientsandquantities']) {
      totalCost += ingredientandquantity['ingredient']['costperpackage'] * ingredientandquantity['quantity'];
    }
    return totalCost;
  }

  private async avgManufacturingRunSize(sku: any): Promise<Number> {
    var startDate: Date = new Date(new Date().getFullYear()-10,0,0,0,0,0,0);
    var activities = await this.restv2.getActivities(AndVsOr.AND, {$gte:startDate}, {$ne:null}, sku['_id'], 10000);
    if (activities.length == 0) {
      return sku['manufacturingrate']*10; //assume 1 day of manufacturing
    }
    var totalNumCases = 0;
    for (let activity of activities) {
      totalNumCases += activity['numcases'];
    }
    return totalNumCases/activities.length;
  }

  private summarizeYear(year: string, allSalesInYear: any[], sku: any) {
    var summary = {};
    summary['year'] = year;
    summary['sku'] = sku;
    var totalRevenue = 0;
    var totalNumCases = 0;
    for (let sale of allSalesInYear) {
      totalRevenue += sale['numcases'] * sale['pricepercase'];
      totalNumCases += sale['numcases'];
    }
    summary['totalrevenue'] = totalRevenue;
    summary['averagerevenuepercase'] = (totalRevenue/totalNumCases);
    return summary;
  }
}
