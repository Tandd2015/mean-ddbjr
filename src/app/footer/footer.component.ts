import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Input() securitySwap: boolean = false;
  public businessFooter: string = 'Dragon-Onyx Software Solutions';

  constructor() { };

}
