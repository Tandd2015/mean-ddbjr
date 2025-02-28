import { Component } from '@angular/core';

@Component({
  selector: 'app-ap-cookie-policy',
  templateUrl: './ap-cookie-policy.component.html',
  styleUrls: ['./ap-cookie-policy.component.css']
})
export class ApCookiePolicyComponent {
  public siteCookie: string = 'this website';
  public businessCookie: string = 'This Website';
  public effectiveDateCookie: string = '02-11-2025';

  public idArrayCookie: string[] = ["policyCookie", "whatCookie", "howCookie", "typeCookie", "controlCookie", "dateCookie"];

  constructor() {};
  public toCookie(navClick: Event, id: string): void {
    navClick.preventDefault();
    document.getElementById(`${id}`)?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  };
}
