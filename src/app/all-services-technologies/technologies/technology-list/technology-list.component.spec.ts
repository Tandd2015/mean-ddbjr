import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyListComponent } from './technology-list.component';

describe('TechnologyListComponent', () => {
  let component: TechnologyListComponent;
  let fixture: ComponentFixture<TechnologyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnologyListComponent]
    });
    fixture = TestBed.createComponent(TechnologyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
