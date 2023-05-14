import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstnoteComponent } from './firstnote.component';

describe('FirstnoteComponent', () => {
  let component: FirstnoteComponent;
  let fixture: ComponentFixture<FirstnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
