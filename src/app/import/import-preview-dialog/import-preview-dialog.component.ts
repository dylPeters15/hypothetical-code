import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-import-preview-dialog',
  templateUrl: './import-preview-dialog.component.html',
  styleUrls: ['./import-preview-dialog.component.css']
})
export class ImportPreviewDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ImportPreviewDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
  }

  cancel() {
    this.dialogRef.close({cancel:true});
  }

  import() {
    this.dialogRef.close(this.data);
  }

  selectAllOld() {
    this.selectAllOldOfSection('ingredients');
    this.selectAllOldOfSection('formulas');
    this.selectAllOldOfSection('skus');
    this.selectAllOldOfSection('productlines');
    this.selectAllOldOfSection('manufacturinglines');
  }

  selectAllNew() {
    this.selectAllNewOfSection('ingredients');
    this.selectAllNewOfSection('formulas');
    this.selectAllNewOfSection('skus');
    this.selectAllNewOfSection('productlines');
    this.selectAllNewOfSection('manufacturinglines');
  }

  selectAllOldOfSection(section) {
    for (var i = 0; i < this.data[section]['conflicts'].length; i++) {
      this.data[section]['conflicts'][i]['select'] = 'old';
      console.log(this.data[section]['conflicts'][i]['select']);
    }
  }

  selectAllNewOfSection(section) {
    for (var i = 0; i < this.data[section]['conflicts'].length; i++) {
      this.data[section]['conflicts'][i]['select'] = 'new';
      console.log(this.data[section]['conflicts'][i]['select']);
    }
  }

  areAllOldSelected() {
    return this.areAllOfSectionOld('ingredients')
    && this.areAllOfSectionOld('formulas')
    && this.areAllOfSectionOld('skus')
    && this.areAllOfSectionOld('productlines')
    && this.areAllOfSectionOld('manufacturinglines');
  }

  areAllNewSelected() {
    return this.areAllOfSectionNew('ingredients')
    && this.areAllOfSectionNew('formulas')
    && this.areAllOfSectionNew('skus')
    && this.areAllOfSectionNew('productlines')
    && this.areAllOfSectionNew('manufacturinglines');
  }

  areAllOfSectionNew(section) {
    for (var i = 0; i < this.data[section]['conflicts'].length; i++) {
      console.log(this.data[section]['conflicts'][i]['select']);
      if (this.data[section]['conflicts'][i]['select'] != 'new') {
        console.log(false);
        return false;
      }
    }
    return true;
  }

  areAllOfSectionOld(section) {
    for (var i = 0; i < this.data[section]['conflicts'].length; i++) {
      console.log(this.data[section]['conflicts'][i]['select']);
      if (this.data[section]['conflicts'][i]['select'] != 'old') {
        console.log(false);
        return false;
      }
    }
    return true;
  }

}
