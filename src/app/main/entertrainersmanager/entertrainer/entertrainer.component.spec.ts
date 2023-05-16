import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertrainerComponent } from './entertrainer.component';

describe('EntertrainerComponent', () => {
  let component: EntertrainerComponent;
  let fixture: ComponentFixture<EntertrainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntertrainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntertrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
