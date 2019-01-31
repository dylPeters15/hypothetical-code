import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';

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
  