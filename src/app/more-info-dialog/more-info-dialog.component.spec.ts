import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreInfoDialogComponent } from './more-info-dialog.component';

describe('MoreInfoDialogComponent', () => {
  let component: MoreInfoDialogComponent;
  let fixture: ComponentFixture<MoreInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
