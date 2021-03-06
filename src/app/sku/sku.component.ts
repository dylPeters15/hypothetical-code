import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar, MatAutocomplete} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewSkuDialogComponent } from '../new-sku-dialog/new-sku-dialog.component';
import {FormulaDetailsDialogComponent} from '../formula-info-dialog/formula-info-dialog.component';
import { AfterViewChecked } from '@angular/core';
import { auth } from '../auth.service';
import {ExportToCsv} from 'export-to-csv';
import { LineToLineMappedSource } from 'webpack-sources';
import { ConfirmDeletionDialogComponent } from '../confirm-deletion-dialog/confirm-deletion-dialog.component';
import { RestServiceV2, AndVsOr } from '../restv2.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ENTER } from '@angular/cdk/keycodes';


// skuname', 'skunumber','caseupcnumber', 'unitupcnumber', 'unitsize', 'countpercase', 'formula', 'formulascalingfactor', "manufacturingrate", "comment"

export interface UserForTable {
  skuname: String;
  skunumber: Number;
  caseupcnumber: Number;
  unitupcnumber: Number;
  unitsize: String;
  countpercase: Number;
  formula: any;
  formulascalingfactor: Number;
  productline: any;
  manufacturinglines: any[];
  manufacturingrate: Number;
  comment: String;
  checked: boolean;
}

export class ExportableSKU {
  skuname: String;
  skunumber: Number;
  caseupcnumber: Number;
  unitupcnumber: Number;
  unitsize: String;
  countpercase: Number;
  formula: any;
  formulascalingfactor: Number;
  productline: String;
  manufacturinglines: any[];
  manufacturingrate: Number;
  comment: String;
  constructor(userForTable){
    this.skunumber = userForTable.skunumber;
    this.skuname = userForTable.skuname;
    this.caseupcnumber = userForTable.caseupcnumber;
    this.unitupcnumber = userForTable.unitupcnumber;
    this.unitsize = userForTable.unitsize;
    this.countpercase = userForTable.countpercase;
    this.formula = userForTable.formula;
    this.formulascalingfactor = userForTable.formulascalingfactor;
    this.productline = userForTable.productline;
    this.manufacturinglines = userForTable.manufacturinglines;
    this.manufacturingrate = userForTable.manufacturingrate;
    this.comment = userForTable.comment;
  }
}

/**
 * @title Table dynamically changing the columns displayed
 */
@Component({
    selector: 'app-sku',
    templateUrl: './sku.component.html',
    styleUrls: ['./sku.component.css']
  })
export class SkuComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER];

  selectedIngredients = [];
  ingredientCtrl = new FormControl();
  autoCompleteIngredients: Observable<string[]> = new Observable(observer => {
    this.ingredientCtrl.valueChanges.subscribe(async newVal => {
      var ingredients = await this.restv2.getIngredients(AndVsOr.AND, null, "(?i).*"+newVal+".*", null, 1000);
      ingredients = ingredients.filter((value, index, array) => {
        for (let ingredient of this.selectedIngredients) {
          if (ingredient._id == value._id) {
            return false;
          }
        }
        return true;
      });
      observer.next(ingredients);
    });
  });
  @ViewChild('ingredientInput') ingredientInput: ElementRef<HTMLInputElement>;
  @ViewChild('ingredientauto') ingredientmatAutocomplete: MatAutocomplete;
  ingredientremove(ingredient) {
    for (var i = 0; i < this.selectedIngredients.length; i++) {
      if (this.selectedIngredients[i]._id == ingredient._id) {
        this.selectedIngredients.splice(i, 1);
        i--;
      }
    }
    this.refreshData();
  }
  ingredientselected(event){
    this.selectedIngredients.push(event.option.value);
    this.refreshData();
  }
  ingredientadd(event) {
    this.ingredientInput.nativeElement.value = "";
  }


  selectedProductLines = [];
  productlineCtrl = new FormControl();
  autoCompleteProductLines: Observable<string[]> = new Observable(observer => {
    this.productlineCtrl.valueChanges.subscribe(async newVal => {
      var productlines = await this.restv2.getProductLines(AndVsOr.AND, null, "(?i).*"+newVal+".*", 1000);
      productlines = productlines.filter((value, index, array) => {
        for (let productline of this.selectedProductLines) {
          if (productline._id == value._id) {
            return false;
          }
        }
        return true;
      });
      observer.next(productlines);
    });
  });
  @ViewChild('productlineInput') productlineInput: ElementRef<HTMLInputElement>;
  @ViewChild('productlineauto') productlinematAutocomplete: MatAutocomplete;
  productlineremove(productline) {
    for (var i = 0; i < this.selectedProductLines.length; i++) {
      if (this.selectedProductLines[i]._id == productline._id) {
        this.selectedProductLines.splice(i, 1);
        i--;
      }
    }
    this.refreshData();
  }
  productlineselected(event){
    this.selectedProductLines.push(event.option.value);
    this.refreshData();
  }
  productlineadd(event) {
    this.productlineInput.nativeElement.value = "";
  }


  constructor(public restv2: RestServiceV2, public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  allReplacement = 54321;
  //displayedColumns: string[] = ['checked', 'skuname', 'skunumber','caseupcnumber', 'unitupcnumber', 'unitsize', 'countpercase', 'formula', 'formulascalingfactor', 'manufacturingrate', 'comment', 'actions'];
  displayedColumns: string[] = ['checked', 'skuname', 'skunumber', 'unitsize', 'countpercase', 'formula', 'comment'];
  data: UserForTable[] = [];
  dialogRef: MatDialogRef<MoreInfoDialogComponent>;
  newDialogRef: MatDialogRef<NewSkuDialogComponent>;
  formulaDetailsRef: MatDialogRef<FormulaDetailsDialogComponent>;

  dataSource =  new MatTableDataSource<UserForTable>(this.data);
  productmanager: boolean = false;
  filterQuery: string = "";
  filteredData =  new MatTableDataSource<UserForTable>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.productmanager = auth.isAuthenticatedForProductManagerOperation();
    if (this.productmanager) {
      this.displayedColumns.push('actions');
    }
    this.paginator.pageSize = 20;
    this.refreshData();
  }

  getPageSizeOptions() {
    return [20, 50, 100, this.allReplacement];
  }

  refreshData(filterQueryData?) {
    filterQueryData = filterQueryData ? "(?i).*"+filterQueryData+".*" : "(?i).*"+this.filterQuery+".*"; //this returns things that have the pattern anywhere in the string
    // this.restv2.getSkus(AndVsOr.OR, oldSku.skuname, oldSku.skuname, null,null,null,null,1);
    this.restv2.getSkus(AndVsOr.OR, null, '(?i).*' +filterQueryData+'.*', null, null, null, null, this.paginator.pageSize*10).then(response => {
      this.data = response;
      this.data.forEach(user => {
        user['checked'] = false;
      });
      //for each:
        //sku['manufacturinglines'] = await restElement.getManufacturingLines(sku)
      console.log(this.data);

      //filter skus by ingredients (this is implicitly an OR gate of the ingredients - if a SKU contains at least 1 of the selected ingredients it will be shown)
      if (this.selectedIngredients.length > 0) {
        this.data = this.data.filter((value, index, array) => {
          for (let selectedIngredient of this.selectedIngredients) {
            for (let ingredientandquantity of value.formula.ingredientsandquantities) {
              console.log(ingredientandquantity.ingredient);
              if (selectedIngredient._id == ingredientandquantity.ingredient._id) {
                return true;
              }
            }
          }
          return false;
        });
      }

      //filter skus by product lines (this is implicitly an OR gate of the product lines - if at least 1 of the product lines contains the sku then the sku will be shown)
      if (this.selectedProductLines.length > 0) {
        this.data = this.data.filter((value, index, array) => {
          for (let selectedProductLine of this.selectedProductLines) {
            for (let sku of selectedProductLine.skus) {
              if (sku.sku._id == value['_id']) {
                return true;
              }
            }
          }
          return false;
        });
      }
      


      this.dataSource =  new MatTableDataSource<UserForTable>(this.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  seeInfo(type, content) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {information_content: content, information_type: type};
    this.dialogRef = this.dialog.open(MoreInfoDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  // edit
  newSku(edit, skuname, skunumber, caseupcnumber, unitupcnumber, unitsize, countpercase, formula, formulascalingfactor, manufacturingrate,manufacturingsetupcost, manufacturingruncost, comment, manufacturinglines, productline) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {edit: edit, present_name: skuname, present_skuNumber: skunumber, present_caseUpcNumber: caseupcnumber, present_unitUpcNumber: unitupcnumber, present_unitSize:unitsize, present_countPerCase:countpercase, present_formula:formula,present_formulascalingfactor:formulascalingfactor, present_manufacturingrate:manufacturingrate, present_manufacturingsetupcost: manufacturingsetupcost, present_manufacturingruncost: manufacturingruncost, present_comment:comment, present_manufacturinglines: manufacturinglines, present_productline: productline};
    this.newDialogRef = this.dialog.open(NewSkuDialogComponent, dialogConfig);
    this.newDialogRef.afterClosed().subscribe(event => {
      this.refreshData();
    });
  }

  seeFormulaDetails(formula) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {present_formula: formula};
    this.formulaDetailsRef = this.dialog.open(FormulaDetailsDialogComponent, dialogConfig);
  }

  newSkuButton()
  {
    this.newSku(false, "", null, null, null, "", null, null, null, null, null,null,"",null,null);
  }

  sortData() {
    this.data.sort((a,b) => {
      return a.skuname > b.skuname ? 1 : -1;
    });
  }

  deleteSkuConfirmed(sku) {
    this.rest.deleteSku(sku['skuname']).subscribe(response => {
      this.snackBar.open("Stock Keeping Unit " + sku['skuname'] + " deleted successfully.", "close", {
        duration: 2000,
      });
      this.data = this.data.filter((value, index, arr) => {
        return value.skuname != sku['skuname'];
      });
      this.refreshData();
    });
  }



  deleteSelected() {
    this.data.forEach(async sku => {
      var affectedManufacturingLines = [];
      var affectedManufacturingLineNames = [];
      var affectedProductLines = [];
      var affectedProductLineNames = [];
      var affectedActivityNames = [];
      if (sku.checked) {
        var thisobject = this;
        let promise1 = new Promise((resolve, reject) => {
          thisobject.rest.getLine('', '.*','','',50).subscribe(lines => {
            lines.forEach((line) => {
              line['skus'].forEach((skuinline) => {
                if(skuinline['sku']){
                console.log('skuinline', skuinline['sku'], sku)
                if (skuinline['sku']['_id'] == sku['_id']) {
                  affectedManufacturingLines.push(line);
                  affectedManufacturingLineNames.push(line['linename'])
                }
                }
              })
              
            });
            resolve();
          });
        });
        let promise2 = new Promise((resolve, reject) => {
          thisobject.rest.getProductLines("",".*", 50).subscribe(lines => {
            console.log(lines)
            lines.forEach((line) => {
              line['skus'].forEach((skuinline) => {
                if(skuinline['sku']){
                  console.log('skuinline', skuinline['sku'], sku)
                  if (skuinline['sku']['_id'] == sku['_id']) {
                    affectedProductLines.push(line);
                    affectedProductLineNames.push(line['productlinename'])
                  }
                }

              })
            });
            resolve();
          });
        });
        let affectedActivities = await this.restv2.getActivities(AndVsOr.OR, null,null, sku['_id'],50);
        console.log("Activities Affected:", affectedActivities);
        promise1.then(() => {
          promise2.then(() => {
            if (affectedManufacturingLines.length == 0 && affectedProductLines.length == 0 && affectedActivities.length == 0) {
              this.deleteSkuConfirmed(sku);
            }
            else {
              var totalAffected = [];
              console.log(affectedProductLineNames);
              totalAffected.push(affectedManufacturingLineNames);
              totalAffected.push(affectedProductLineNames);
              if(affectedActivities){
                if(affectedActivities.length == 1){
                  totalAffected.push(affectedActivities.length + " Activity")
                }
                else{
                  totalAffected.push(affectedActivities.length + " Activities")
                }
                
              }
              const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
                width: '250px',
                data: {ingredient: sku['skuname'],
                    affectedFormulaNames: totalAffected}
              }); 
                
              dialogRef.afterClosed().subscribe(async closeData => {
                if (closeData && closeData['confirmed']) {
                  this.deleteSkuConfirmed(sku);

                  console.log("Affected:", affectedActivities)

                  for(var i = 0; i<affectedActivities.length; i++){
                    let activity = affectedActivities[i];
                    console.log("ACT:", activity)
                    var goals = await this.restv2.getGoals(AndVsOr.OR, null,null, ".*", null,100);
                    console.log("GOALS", goals)
                    for(var j = 0; j< goals.length; j++){
                      let goal = goals[j];
                      var updatedActivities: any = [];
                      for(var k = 0; k<goal['activities'].length; k++){
                        let goalsActivity = goal['activities'][k];
                        console.log("GOAL ACT:", goalsActivity)
                        if(goalsActivity['activity']['_id'] != activity['_id']){
                          updatedActivities.push({activity: goalsActivity['_id']})
                        }
                      }
                      console.log("updating:", updatedActivities)
                      var updatedGoal = await this.restv2.modifyGoal(AndVsOr.AND, goal['goalname'],goal['goalname'],updatedActivities, goal['date'],goal['enabled']);
                      console.log("modified:", updatedGoal)
                    }
                  }
                  affectedActivities.forEach(activity => {
                    this.restv2.deleteActivity(AndVsOr.OR, activity['_id']).then(response => {
                      console.log("Deleted", response)
                    })
                  });
                  affectedManufacturingLines.forEach((line) => {
                    let newSkus = []; 
                    line['skus'].forEach((oldsku) => {
                      console.log(oldsku)
                      if((oldsku['sku']['_id'] != sku['_id'])) {
                        if (newSkus) {
                          newSkus.push(oldsku);
                        }
                        else {
                          newSkus = oldsku;
                        } 
                      }
                    });
                    this.rest.modifyLine(line['linename'], line['linename'], line['shortname'],
                    newSkus, line['comment']).subscribe(response => {
                      if (response['nModified']) {
                        this.snackBar.open("Successfully modified line " + line['linename'] + ".", "close", {
                          duration: 2000,
                        });
                        console.log('success')
                      } else {
                        console.log(response)
                        this.snackBar.open("Error modifying line " + line['linename'] + ".", "close", {
                          duration: 2000,
                        });
                      }
                    })
                  }) 
                  affectedProductLines.forEach((line) => {
                    let newSkus = [];
                    line['skus'].forEach((oldsku) => {
                      if((oldsku['sku']['_id'] != sku['_id'])) {
                        if (newSkus) {
                          newSkus.push(oldsku);
                        }
                        else {
                          newSkus = oldsku;
                        }
                      }
                    });
                    console.log('oldsku', line['skus'])
                    console.log('modified', newSkus)
                    this.rest.modifyProductLine(line['productlinename'], line['productlinename'],
                    newSkus).subscribe(response => {
                      if (response['nModified']) {
                        this.snackBar.open("Successfully modified line " + line['productlinename'] + ".", "close", {
                          duration: 2000,
                        });
                        console.log('success')
                      } else {
                        console.log(response)
                        this.snackBar.open("Error modifying line " + line['productlinename'] + ".", "close", {
                          duration: 2000,
                        });
                      }
                    })
                  })       
                }
              });
            }
          })
          
          
        })
      }
    });
  }

  exportSelected(){
    let exportData: ExportableSKU[] = [];
    this.data.forEach(sku => {
      if(sku.checked) {
        let skuToExport = new ExportableSKU(sku);
        exportData.push(skuToExport);
      }
    });
      const options = { 
        fieldSeparator: ',',
        filename: 'skus',
        quoteStrings: '',
        decimalSeparator: '.',
        showLabels: true, 
        showTitle: false,
        title: 'SKUs',
        useTextFile: false,
        useBom: true,
        headers: ["SKU#","Name","Case UPC", "Unit UPC", "Unit Size", "Count per case", "Product Line Name", "Comment"]
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(exportData);
  }

   async modifySelected(oldSku) {
     var skuObject = await this.restv2.getSkus(AndVsOr.OR, oldSku.skuname, oldSku.skuname, null,null,null,null,1);
     let sku = skuObject[0];
     let manufacturingLinesWithSku = [];
     var manufacturinglines = await this.restv2.getLine(AndVsOr.OR, null,".*", null,null,50);
     manufacturinglines.forEach(manufacturingline => {
      console.log("line iz: " + manufacturingline);
      console.log("line skus iz: " + manufacturingline['skus']);
       manufacturingline['skus'].forEach(manufacturingLineSku => {
         if(manufacturingLineSku['_id'] == sku['_id']){
          manufacturingLinesWithSku.push(manufacturingline)
         }
         
       });
     });
     let productLinesWithSku = [];
     var productlines = await this.restv2.getProductLines(AndVsOr.OR, null, ".*", 1000);
     productlines.forEach(productline => {
      productline['skus'].forEach(productLineSku => {
        if(productLineSku['sku']['_id'] == sku['_id']){
          productLinesWithSku.push(productline['productlinename'])
        }
      });
    });
     console.log("MAN: " + manufacturingLinesWithSku);
     console.log("PROD: " + productLinesWithSku);
      this.modifySkuConfirmed(oldSku.skuname, oldSku.skunumber, oldSku.caseupcnumber, oldSku.unitupcnumber, oldSku.unitsize, oldSku.countpercase, oldSku.formula, oldSku.formulascalingfactor, oldSku.manufacturingrate, sku['manufacturingsetupcost'], sku['manufacturingruncost'], oldSku.comment, sku['_id'], manufacturingLinesWithSku, productLinesWithSku); 
  }

  modifySkuConfirmed(present_name, present_skuNumber, present_caseUpcNumber, present_unitUpcNumber,present_unitSize,present_countPerCase,present_formula, present_formulascalingfactor, present_manufacturingrate, present_manufacturingsetupcost, present_manufacturinruncost, present_comment, present_id, manufacturinglines, productline) {
    this.newSku(true, present_name, present_skuNumber, present_caseUpcNumber, present_unitUpcNumber, present_unitSize, present_countPerCase, present_formula, present_formulascalingfactor,present_manufacturingrate, present_manufacturingsetupcost, present_manufacturinruncost, present_comment, manufacturinglines, productline);
  }

  removeIngredient(ingredient, sku) {
    let newSkus;
    // this.rest.getIngredientByNumber(ingredient).subscribe(response => {
    //   newSkus = response.skus
    //   console.log("new skus", newSkus)
    //   newSkus.push(sku);
    //   newSkus = newSkus.filter(function(e) { return e !== sku })
    //   console.log("new skus", newSkus)
    //   this.rest.addIngredientSku(ingredient, newSkus).subscribe(response => {
    //     console.log("New ingredient data", response)
    //   });
    // });
  }
  
  deselectAll() {
    this.data.forEach(sku => {
      sku.checked = false;
    });
  }

  selectAll() {
    this.dataSource.filteredData.forEach(sku => {
      sku.checked = true;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  noneSelected(): boolean {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].checked) {
        return false;
      }
    }
    return true;
  }

}