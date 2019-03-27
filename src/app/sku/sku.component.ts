import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MatDialog, MatSort, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";
import { MoreInfoDialogComponent } from '../more-info-dialog/more-info-dialog.component';
import { NewSkuDialogComponent } from '../new-sku-dialog/new-sku-dialog.component';
import { AfterViewChecked } from '@angular/core';
import { auth } from '../auth.service';
import {ExportToCsv} from 'export-to-csv';
import { LineToLineMappedSource } from 'webpack-sources';
import { ConfirmDeletionDialogComponent } from '../confirm-deletion-dialog/confirm-deletion-dialog.component';
import { RestServiceV2, AndVsOr } from '../restv2.service';


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

  constructor(public restv2: RestServiceV2, public rest:RestService, private snackBar: MatSnackBar, private dialog: MatDialog) { }
  allReplacement = 54321;
  displayedColumns: string[] = ['checked', 'skuname', 'skunumber','caseupcnumber', 'unitupcnumber', 'unitsize', 'countpercase', 'formula', 'formulascalingfactor', 'manufacturingrate', 'comment', 'actions'];
  data: UserForTable[] = [];
  dialogRef: MatDialogRef<MoreInfoDialogComponent>;
  newDialogRef: MatDialogRef<NewSkuDialogComponent>;
  dataSource =  new MatTableDataSource<UserForTable>(this.data);
  admin: boolean = false;
  filterQuery: string = "";
  filteredData =  new MatTableDataSource<UserForTable>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.admin = auth.isAuthenticatedForAdminOperation();
    this.paginator.pageSize = 20;
    this.admin = auth.isAuthenticatedForAdminOperation();
    this.refreshData();
  }

  getPageSizeOptions() {
    return [20, 50, 100, this.allReplacement];
  }

  refreshData(filterQueryData?) {
    filterQueryData = filterQueryData ? "(?i).*"+filterQueryData+".*" : "(?i).*"+this.filterQuery+".*"; //this returns things that have the pattern anywhere in the string
    this.rest.getSkus("", filterQueryData, null, null, null, "", this.paginator.pageSize*10).subscribe(response => {
      this.data = response;
      this.data.forEach(user => {
        user['checked'] = false;
      });
      //for each:
        //sku['manufacturinglines'] = await restElement.getManufacturingLines(sku)
      console.log(this.data);
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
    this.data.forEach(sku => {
      var affectedManufacturingLines = [];
      var affectedManufacturingLineNames = [];
      var affectedProductLines = [];
      var affectedProductLineNames = [];
      if (sku.checked) {
        var thisobject = this;
        let promise1 = new Promise((resolve, reject) => {
          thisobject.rest.getLine('', '.*','','',50).subscribe(lines => {
            lines.forEach((line) => {
              line['skus'].forEach((skuinline) => {
                console.log('skuinline', skuinline['sku'], sku)
                if (skuinline['sku']['_id'] == sku['_id']) {
                  affectedManufacturingLines.push(line);
                  affectedManufacturingLineNames.push(line['linename'])
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
                console.log('skuinline', skuinline['sku'], sku)
                if (skuinline['sku']['_id'] == sku['_id']) {
                  affectedProductLines.push(line);
                  affectedProductLineNames.push(line['productlinename'])
                }
              })
            });
            resolve();
          });
        });
        promise1.then(() => {
          promise2.then(() => {
            if (affectedManufacturingLines.length == 0 && affectedProductLines.length == 0) {
              this.deleteSkuConfirmed(sku);
            }
            else {
              var totalAffected = [];
              console.log(affectedProductLineNames);
              totalAffected.push(affectedManufacturingLineNames);
              totalAffected.push(affectedProductLineNames);
              const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
                width: '250px',
                data: {ingredient: sku['skuname'],
                    affectedFormulaNames: totalAffected}
              }); 
                
              dialogRef.afterClosed().subscribe(closeData => {
                if (closeData && closeData['confirmed']) {
                  this.deleteSkuConfirmed(sku);
                  affectedManufacturingLines.forEach((line) => {
                    let newSkus; 
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
                    console.log('oldsku', line['skus'])
                    console.log('modified', newSkus)
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
                    let newSkus;
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
       manufacturingline['skus'].forEach(manufacturingLineSku => {
         if(manufacturingLineSku['sku']['_id'] == sku['_id'] && manufacturingLinesWithSku.indexOf(manufacturingline['linename']) == -1){
          manufacturingLinesWithSku.push(manufacturingline)
         }
         
       });
     });
     let productLinesWithSku = [];
     var productlines = await this.restv2.getProductLines(AndVsOr.OR, null, ".*", 1000);
     productlines.forEach(productline => {
      productline['skus'].forEach(productLineSku => {
        if(productLineSku['sku']['_id'] == sku['_id'] && productLinesWithSku.indexOf(productline['productlinename'] == -1)){
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