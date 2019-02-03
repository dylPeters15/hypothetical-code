import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort, MatTableDataSource, MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RestService } from '../rest.service';

export interface IngredientData {
  name: string;
  number: number;
  vendorInfo: string;
  packageSize: string;
  costPerPackage: string;
  comment: string;
}

let INGREDIENT_DATA;  
// const INGREDIENT_DATA: IngredientData[] = [
//     {name: 'tomato', number: 12, vendorInfo: 'Hypothetical Farm', 
//     packageSize: '200 units', cost: '$50', comment: 'This is a comment.'}
// ];
@Component({
  selector: 'app-ingredient-inventory',
  templateUrl: './ingredient-inventory.component.html',
  styleUrls: ['./ingredient-inventory.component.css']
})
export class IngredientInventoryComponent implements OnInit {

  name: string;
  number: number;
  vendorInfo: string;
  packageSize: string;
  costPerPackage: string;
  comment: string;
  ingredients: any = [];
  data: IngredientData[] = [];
  dataSource =  new MatTableDataSource<IngredientData>(this.data);

  constructor(public dialog: MatDialog, public rest:RestService) {}

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.rest.getIngredients().subscribe(data => {
      this.ingredients = data
      console.log(data);
      this.ingredients.forEach(ingredient => {
        console.log(ingredient)
        this.data.push(ingredient);
        console.log(ingredient['costPerPackage'])
        console.log(ingredient['comment'])
      });
      this.dataSource = new MatTableDataSource<IngredientData>(this.data);
      // this.dataSource.paginator = this.paginator;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddIngredientDialogComponent, {
      width: '700px',
      data: {name: this.name, number: this.number, vendorInfo: this.vendorInfo, 
            packageSize: this.packageSize, costPerPackage: this.costPerPackage, 
            comment: this.comment}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  displayedColumns: string[] = ['select', 'name', 'number', 'vendorInfo', 
  'packageSize', 'costPerPackage', 'comment'];
  
  selection = new SelectionModel<IngredientInventoryComponent>(true, []);

  deleteSelected() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(DeleteIngredientDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(event => {
      if (event.validated) {
        INGREDIENT_DATA.forEach(ingredient => {
          if (ingredient.checked) {
            // this.deleteIngredient(ingredient.name);
          }
        });
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //       this.selection.clear() :
  //       this.dataSource.data.forEach(row => this.selection.select(row));
  // }
  
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

@Component({
  selector: 'app-add-ingredient-dialog',
  templateUrl: './add-ingredient.component.html',
})
export class AddIngredientDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddIngredientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IngredientData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-delete-ingredient-dialog',
  templateUrl: './delete-ingredient.component.html',
})
export class DeleteIngredientDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteIngredientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IngredientData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}



  