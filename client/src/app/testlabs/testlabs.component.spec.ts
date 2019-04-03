import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestlabsComponent } from './testlabs.component';

describe('TestlabsComponent', () => {
  let component: TestlabsComponent;
  let fixture: ComponentFixture<TestlabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestlabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestlabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
