import { Component, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-slide-show',
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.css']
})
export class SlideShowComponent {
  public paused: boolean = false;
  public unpauseOnArrow: boolean = false;
  public pauseOnIndicator: boolean = false;
  public pauseOnHover: boolean = true;
  public pauseOnFocus: boolean = true;

  @ViewChild('carousel', {static: true}) carousel!: NgbCarousel;

  public carouselImages: Array<string> = [
    '../assets/images/1.jpg',
    '../assets/images/2.jpg',
    '../assets/images/3.jpg',
    '../assets/images/4.jpg',
    '../assets/images/5.jpg',
    '../assets/images/6.jpg',
  ];

  public carouselAlts: Array<string> = [
    'A picture of an advertisement for Dragon-Onyx Software Solutions.',
    'A picture of an advertisement for Dragon-Onyx Software Solutions.',
    'A picture of an advertisement for Dragon-Onyx Software Solutions.',
    'A picture of an advertisement for Dragon-Onyx Software Solutions.',
    'A picture of an advertisement for Dragon-Onyx Software Solutions.',
    'A picture of an advertisement for Dragon-Onyx Software Solutions.',
  ];

  constructor() { }
  togglePaused(): void {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(event: NgbSlideEvent): void {

    if (this.unpauseOnArrow && event.paused && (event.source === NgbSlideEventSource.ARROW_LEFT || event.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }

    if (this.pauseOnIndicator && !event.paused && event.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }
}

