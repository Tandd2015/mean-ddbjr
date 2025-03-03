import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewNewComponent } from './review-new.component';

describe('ReviewNewComponent', () => {
  let component: ReviewNewComponent;
  let fixture: ComponentFixture<ReviewNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewNewComponent]
    });
    fixture = TestBed.createComponent(ReviewNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
