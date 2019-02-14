import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProductLineImportPreviewComponent),
  multi: true
};

@Component({
  selector: 'app-product-line-import-preview',
  templateUrl: './product-line-import-preview.component.html',
  styleUrls: ['./product-line-import-preview.component.css'],
  providers: [customValueProvider]
})
export class ProductLineImportPreviewComponent implements ControlValueAccessor {

  constructor() { }

  _value = '';
  stringified = '';

  propagateChange: any = () => { };

  @Input() label: string;

  writeValue(value: any) {
    if (value) {
      this._value = value;
      this.stringified = JSON.stringify(value);
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void { }

  onChange(event) {
    this.stringified = JSON.stringify(event.target.value);
    this.propagateChange(event.target.value);
  }

}
