import { Injectable } from '@angular/core';
import { RestServiceV2, AndVsOr } from '../../restv2.service';
import { ExportToCsv } from 'export-to-csv';

@Injectable({
  providedIn: 'root'
})
export class SalesSummaryRowCalcService {

  constructor(public restv2: RestServiceV2) { }

  async summarizeTotal(allSales: any[], sku: any): Promise<any[]> {
    var summary = {};

    var revenueSum = 0;
    var caseSum = 0;
    for (var sale of allSales) {
      revenueSum += sale['numcases'] * sale['pricepercase'];
      caseSum += sale['numcases'];
    }
    summary['revenuesum'] = revenueSum.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    summary['averagerevenuepercase'] = caseSum == 0 ? 0 : (revenueSum / caseSum);

    summary['averagemanufacturingrunsize'] = await this.avgManufacturingRunSize(sku);
    summary['ingredientcostpercase'] = this.ingredientCostPerCase(sku);
    summary['averagemanufacturingsetupcostpercase'] = summary['averagemanufacturingrunsize'] == 0 ? 0 : (sku['manufacturingsetupcost'] / summary['averagemanufacturingrunsize']);
    summary['manufacturingruncostpercase'] = summary['averagemanufacturingrunsize'] == 0 ? 0 : (sku['manufacturingruncost'] / summary['averagemanufacturingrunsize']);
    summary['totalcogspercase'] = summary['ingredientcostpercase'] + summary['averagemanufacturingsetupcostpercase'] + summary['manufacturingruncostpercase'];
    summary['averageprofitpercase'] = summary['averagerevenuepercase'] - summary['totalcogspercase'];
    summary['profitmargin'] = summary['totalcogspercase'] == 0 ? 0 : (((summary['averagerevenuepercase'] / summary['totalcogspercase']) - 1) * 100);

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
    var startDate: Date = new Date(new Date().getFullYear() - 9, 0, 0, 0, 0, 0, 0);
    var activities = await this.restv2.getActivities(AndVsOr.AND, { $gte: startDate }, { $ne: null }, sku['_id'], 10000);
    if (activities.length == 0) {
      return sku['manufacturingrate'] * 10; //assume 1 day of manufacturing
    }
    var totalNumCases = 0;
    for (let activity of activities) {
      totalNumCases += activity['numcases'];
    }
    return totalNumCases / activities.length;
  }

  async exportSKUSummary(sku, selectedCustomerId) {
    var allSales = await this.restv2.getSales(AndVsOr.AND, sku['_id'], selectedCustomerId == "all" ? null : selectedCustomerId, new Date(new Date().getFullYear() - 9, 0), null, 54321);
    var sales = await this.summarizeTotal(allSales, sku);

    const options = {
      fieldSeparator: ',',
      filename: sku['skuname'] + " sales summary",
      quoteStrings: '',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      title: sku['skuname'],
      useTextFile: false,
      useBom: true,
      headers: ["Revenue Sum", "Average Manufacturing Run Size", "Ingredient Cost Per Case", "Average Manufacturing Setup Cost Per Case", "Average Manufacturing Run Cost Per Case", "Average COGS Per Case", "Average Revenue Per Case", "Average Profit Per Case", "Profit Margin"]
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(sales);
  }
}
