import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkuImportPreviewComponent),
  multi: true
};

@Component({
  selector: 'app-sku-import-preview',
  templateUrl: './sku-import-preview.component.html',
  styleUrls: ['./sku-import-preview.component.css'],
  providers: [customValueProvider]
})
export class SkuImportPreviewComponent implements ControlValueAccessor {

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
