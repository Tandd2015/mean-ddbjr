import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgParticlesModule } from "ng-particles";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import * as fromFooter from './footer';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlideShowComponent } from './slide-show/slide-show.component';

@NgModule({
  declarations: [
    AppComponent,
    ...fromFooter.components,
    SlideShowComponent
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
