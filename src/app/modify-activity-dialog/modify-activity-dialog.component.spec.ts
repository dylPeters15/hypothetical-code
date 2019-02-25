import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyActivityDialogComponent } from './modify-activity-dialog.component';

describe('ModifyActivityDialogComponent', () => {
  let component: ModifyActivityDialogComponent;
  let fixture: ComponentFixture<ModifyActivityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyActivityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyActivityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
