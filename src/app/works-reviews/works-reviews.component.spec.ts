import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksReviewsComponent } from './works-reviews.component';

describe('WorksReviewsComponent', () => {
  let component: WorksReviewsComponent;
  let fixture: ComponentFixture<WorksReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorksReviewsComponent]
    });
    fixture = TestBed.createComponent(WorksReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
