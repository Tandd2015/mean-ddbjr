import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import * as fromPolicy from './all-policy';
import * as fromFooter from './footer';
import * as fromWorkReviews from './works-reviews';
import * as fromAllServicesTechnologies from './all-services-technologies'
import * as fromPosts from './posts';
import * as fromReviews from './reviews';

import { SlideShowComponent } from './slide-show/slide-show.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserCookieComponent } from './user-cookie/user-cookie.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AboutComponent } from './about/about.component';
import { SectionsComponent } from './sections/sections.component';

@NgModule({
  declarations: [
    AppComponent,
    ...fromPolicy.components,
    ...fromFooter.components,
    ...fromWorkReviews.components,
    ...fromAllServicesTechnologies.components,
    ...fromPosts.components,
    ...fromReviews.components,
    SlideShowComponent,
    NotFoundComponent,
    UserCookieComponent,
    HomeComponent,
    NavBarComponent,
    AboutComponent,
    SectionsComponent
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
