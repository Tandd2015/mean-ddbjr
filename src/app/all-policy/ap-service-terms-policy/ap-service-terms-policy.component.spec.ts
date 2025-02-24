import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApServiceTermsPolicyComponent } from './ap-service-terms-policy.component';

describe('ApServiceTermsPolicyComponent', () => {
  let component: ApServiceTermsPolicyComponent;
  let fixture: ComponentFixture<ApServiceTermsPolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApServiceTermsPolicyComponent]
    });
    fixture = TestBed.createComponent(ApServiceTermsPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
