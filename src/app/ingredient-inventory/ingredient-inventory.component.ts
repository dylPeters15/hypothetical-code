import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface IngredientData {
    // completion: boolean;
    name: string;
    number: number;
    vendorInfo: string;
    packageSize: string;
    cost: string;
    comment: string;
}
  
const INGREDIENT_DATA: IngredientData[] = [
    {name: 'tomato', number: 12, vendorInfo: 'Hypothetical Farm', 
    packageSize: '200 units', cost: '$50', comment: 'This is a comment.'}
];
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
  cost: string;
  comment: string;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddIngredientDialogComponent, {
      width: '700px',
      data: {name: this.name, animal: this.number, vendorInfo: this.vendorInfo, 
            packageSize: this.packageSize, cost: this.comment, comment: this.comment}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  displayedColumns: string[] = ['name', 'number', 'vendorInfo', 
  'packageSize', 'cost', 'comment'];
  dataSource = new MatTableDataSource(INGREDIENT_DATA);
  
  @ViewChild(MatSort) sort: MatSort;
  
  ngOnInit() {
    this.dataSource.sort = this.sort;
  }
  
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
  