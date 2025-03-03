import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllServicesTechnologiesComponent } from './all-services-technologies.component';

describe('AllServicesTechnologiesComponent', () => {
  let component: AllServicesTechnologiesComponent;
  let fixture: ComponentFixture<AllServicesTechnologiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllServicesTechnologiesComponent]
    });
    fixture = TestBed.createComponent(AllServicesTechnologiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
