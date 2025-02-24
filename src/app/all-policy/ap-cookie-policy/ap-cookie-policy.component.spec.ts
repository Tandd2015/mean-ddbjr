import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApCookiePolicyComponent } from './ap-cookie-policy.component';

describe('ApCookiePolicyComponent', () => {
  let component: ApCookiePolicyComponent;
  let fixture: ComponentFixture<ApCookiePolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApCookiePolicyComponent]
    });
    fixture = TestBed.createComponent(ApCookiePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
