import { Component, OnInit,ViewChild, ElementRef, Inject  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ExportToCsv} from 'export-to-csv';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator } from "@angular/material";

@Component({
  selector: 'app-sku-details',
  templateUrl: './sku-details.component.html',
  styleUrls: ['./sku-details.component.css']
})
export class SkuDetailsComponent implements OnInit {
  skus: any[] = [];
  skuStrings: string[] = [];
  name: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<SkuDetailsComponent>, public rest:RestService, private route: ActivatedRoute, private router: Router)  { }

  ngOnInit() {
    console.log("DATA: " + JSON.stringify(this.data))
    this.skus = this.data.skus;
    this.name = this.data.name;
    this.createSkuStrings(this.skus);
  }

  createSkuStrings(skuList){
    var i;
    for(i = 0; i<skuList.length; i++){
      let currentSku = skuList[i]['sku'];
      let skuString = this.printSKU(currentSku);
      this.skuStrings.push(skuString)
    }
  }

  printSKU(skuObject){
    let sku = '';
    sku += skuObject['skuname'] + ': ' + skuObject['unitsize'] + ' * ' + skuObject['countpercase'] + ' ' + '(' + skuObject['skunumber'] + ')';
    return sku;
}

closeDialog() {
  this.dialogRef.close();
  this.skus = null;
  this.skuStrings = null;
  this.name = null;
}



  

}
