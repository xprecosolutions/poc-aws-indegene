import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestreportsComponent } from './testreports.component';

describe('TestreportsComponent', () => {
  let component: TestreportsComponent;
  let fixture: ComponentFixture<TestreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
