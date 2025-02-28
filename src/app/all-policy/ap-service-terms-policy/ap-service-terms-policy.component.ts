import { Component } from '@angular/core';

@Component({
  selector: 'app-ap-service-terms-policy',
  templateUrl: './ap-service-terms-policy.component.html',
  styleUrls: ['./ap-service-terms-policy.component.css']
})
export class ApServiceTermsPolicyComponent {
  public siteServiceTerm: string = 'this website';
  public businessServiceTerm: string = 'Dragon-Onyx Software Solutions';
  public emailServiceTerm: string = '@gmail.com';
  public effectiveDateServiceTerm: string = '02-11-2025';

  public idArrayServiceTerm: string[] = ["conditionsServiceTerm", "applicableServiceTerm", "copyRightServiceTerm", "disclaimerServiceTerm", "disputeServiceTerm", "licenseServiceTerm", "privacyServiceTerm", "agreementServiceTerm", "dateServiceTerm", "questionServiceTerm"];

  constructor() {};

  public toServiceTerm(navClick: Event, id: string): void {
    navClick.preventDefault();
    document.getElementById(`${id}`)?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  };
}
