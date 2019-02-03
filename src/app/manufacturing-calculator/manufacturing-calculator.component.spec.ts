import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManufacturingCalculatorComponent } from './manufacturing-calculator.component';
import { AppModule } from '../app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('ManufacturingCalculatorComponent', () => {
  let component: ManufacturingCalculatorComponent;
  let fixture: ComponentFixture<ManufacturingCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingCalculatorComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('title should be Manufacturing Calculator', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-card-title').textContent).toContain("Manufacturing Calculator");
  });
});
