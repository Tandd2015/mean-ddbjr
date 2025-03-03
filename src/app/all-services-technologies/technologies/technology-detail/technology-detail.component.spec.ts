import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyDetailComponent } from './technology-detail.component';

describe('TechnologyDetailComponent', () => {
  let component: TechnologyDetailComponent;
  let fixture: ComponentFixture<TechnologyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnologyDetailComponent]
    });
    fixture = TestBed.createComponent(TechnologyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
