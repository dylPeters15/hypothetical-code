import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserMfgLinesDialogComponent } from './view-user-mfg-lines-dialog.component';

describe('ViewUserMfgLinesDialogComponent', () => {
  let component: ViewUserMfgLinesDialogComponent;
  let fixture: ComponentFixture<ViewUserMfgLinesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserMfgLinesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserMfgLinesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
