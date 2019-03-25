import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLineDialogComponent } from './new-line-dialog.component';

describe('NewLineDialogComponent', () => {
  let component: NewLineDialogComponent;
  let fixture: ComponentFixture<NewLineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
