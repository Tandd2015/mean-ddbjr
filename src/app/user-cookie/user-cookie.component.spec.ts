import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCookieComponent } from './user-cookie.component';

describe('UserCookieComponent', () => {
  let component: UserCookieComponent;
  let fixture: ComponentFixture<UserCookieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCookieComponent]
    });
    fixture = TestBed.createComponent(UserCookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
