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
  }

  selectAllNew() {
    this.selectAllNewOfSection('ingredients');
    this.selectAllNewOfSection('formulas');
    this.selectAllNewOfSection('skus');
    this.selectAllNewOfSection('productlines');
  }

  selectAllOldOfSection(section) {
    for (var i = 0; i < this.data[section]['conflicts'].length; i++) {
      this.data[section]['conflicts'][i]['select'] = 'old';
    }
  }

  selectAllNewOfSection(section) {
    for (var i = 0; i < this.data[section]['conflicts'].length; i++) {
      this.data[section]['conflicts'][i]['select'] = 'new';
    }
  }

  areAllOldSelected() {
    return this.areAllOfSectionOld('ingredients')
    && this.areAllOfSectionOld('formulas')
    && this.areAllOfSectionOld('skus')
    && this.areAllOfSectionOld('productlines');
  }

  areAllNewSelected() {
    return this.areAllOfSectionNew('ingredients')
    && this.areAllOfSectionNew('formulas')
    && this.areAllOfSectionNew('skus')
    && this.areAllOfSectionNew('productlines');
  }

  areAllOfSectionNew(section) {
    for (var i = 0; i < this.data[section]['conflicts'].length; i++) {
      if (this.data[section]['conflicts'][i]['select'] != 'new') {
        return false;
      }
    }
    return true;
  }

  areAllOfSectionOld(section) {
    for (var i = 0; i < this.data[section]['conflicts'].length; i++) {
      if (this.data[section]['conflicts'][i]['select'] != 'old') {
        return false;
      }
    }
    return true;
  }

  conflictsExist(): boolean {
    return this.conflictsExistInSection('ingredients') || 
    this.conflictsExistInSection('formulas') || 
    this.conflictsExistInSection('skus') || 
    this.conflictsExistInSection('productlines');
  }

  conflictsExistInSection(section): boolean {
    return this.data[section]['conflicts'].length > 0;
  }

}
