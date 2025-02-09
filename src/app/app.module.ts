import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgParticlesModule } from "ng-particles";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import * as fromFooter from './footer';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlideShowComponent } from './slide-show/slide-show.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserCookieComponent } from './user-cookie/user-cookie.component';

@NgModule({
  declarations: [
    AppComponent,
    ...fromFooter.components,
    SlideShowComponent,
    NotFoundComponent,
    UserCookieComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgParticlesModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
