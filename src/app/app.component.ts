import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { distinctUntilChanged } from 'rxjs/operators';

declare var particlesJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public actTwo: boolean = true;
  public readonly breakPointTwo$: any = this.breakPointObserverTwo.observe(['(max-width: 565px)']).pipe(
    distinctUntilChanged()
  );

  constructor(private readonly breakPointObserverTwo: BreakpointObserver) {};
  ngOnInit(): void {
    this.breakPointTwo$.subscribe((breakpoints: any) => {
      this.breakpointChangedTwo();
    })
    this.initMap();
  }


  public initMap(): void {
    particlesJS.load('particles-js', '../assets/data/particles.json', function() {
    }, null);
  }

  private breakpointChangedTwo(): void {
    if(this.breakPointObserverTwo.isMatched('(min-width: 565px)')) {
      this.actTwo = true;
    }
  }

  public addAct(newAct: boolean): void {
    this.actTwo = newAct;
  }
};
