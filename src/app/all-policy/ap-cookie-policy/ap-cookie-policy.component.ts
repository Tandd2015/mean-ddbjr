import { Component } from '@angular/core';

@Component({
  selector: 'app-ap-cookie-policy',
  templateUrl: './ap-cookie-policy.component.html',
  styleUrls: ['./ap-cookie-policy.component.css']
})
export class ApCookiePolicyComponent {
  public thisSite: string = 'this website';
  public thisSiteC: string = 'This Website';
  public effectiveDateCookie: string = '02-11-2025';


  constructor() { };
}
