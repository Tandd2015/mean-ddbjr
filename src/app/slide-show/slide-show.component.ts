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
    '../assets/images/pI.jpg',
    '../assets/images/computerKeyBoard.jpg',
    '../assets/images/pITools.jpg',
    '../assets/images/pistols.jpg',
    '../assets/images/agentComputer.jpg'
  ];

  public carouselAlts: Array<string> = [
    'A picture of the words Private Investigator.',
    'A picture of cyber security perspective of data and finger print.',
    'A picture of items that a private investigator would use.',
    'A picture of three pistols elegantly placed.',
    'A picture of a private investigator examining forensic data evidence.'
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

