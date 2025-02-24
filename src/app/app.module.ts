import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import * as fromPolicy from './all-policy';
import * as fromFooter from './footer';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlideShowComponent } from './slide-show/slide-show.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserCookieComponent } from './user-cookie/user-cookie.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    ...fromPolicy.components,
    ...fromFooter.components,
    SlideShowComponent,
    NotFoundComponent,
    UserCookieComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
