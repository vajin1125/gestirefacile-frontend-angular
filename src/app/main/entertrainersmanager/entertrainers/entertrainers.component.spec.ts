import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertrainersComponent } from './entertrainers.component';

describe('EntertrainersComponent', () => {
  let component: EntertrainersComponent;
  let fixture: ComponentFixture<EntertrainersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntertrainersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntertrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
