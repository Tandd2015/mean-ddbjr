import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApPrivacyPolicyComponent } from './ap-privacy-policy.component';

describe('ApPrivacyPolicyComponent', () => {
  let component: ApPrivacyPolicyComponent;
  let fixture: ComponentFixture<ApPrivacyPolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApPrivacyPolicyComponent]
    });
    fixture = TestBed.createComponent(ApPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
