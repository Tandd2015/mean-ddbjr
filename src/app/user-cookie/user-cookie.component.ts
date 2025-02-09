import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-cookie',
  templateUrl: './user-cookie.component.html',
  styleUrls: ['./user-cookie.component.css']
})
export class UserCookieComponent implements OnInit, AfterViewInit {
  constructor(private readonly router: Router) { };

  public getCookie(name: string): string | undefined {
    const value: string = " " + document.cookie;
    const parts: string[] = value.split(" " + name + "=");
    console.log("value", `==${value}==`);
    return parts.length < 2 ? undefined : parts.pop()!.split(";").shift();
  };

  public setCookie(name: string, value: any, sameSite: string, secure: string, path?: string, domain?: string,  expiryDays?: number): void {
    const exDate: Date = new Date();
    exDate.setHours(
      exDate.getHours() +
      (typeof expiryDays !== "number" ? 365 : expiryDays) * 24
    );
    document.cookie =
      name + "=" + value +
      ";expires=" + exDate.toUTCString() +
      ";path=" + (path || "/") +
      (domain ? ";domain=" : "") +
      (secure ? `;secure=${secure}` : "") +
      (sameSite ? `;SameSite=${sameSite}` : "");
  };
  ngOnInit(): void {
  };

  public userCookie(): void {
    const cookieName: string = "userAccept";
    if (document.cookie.includes(`${cookieName}`)) { return };

    const $cookiesBanner: HTMLElement | null = document.getElementById("cookies-banner");
    const $cookiesBannerButton: NodeList | null = $cookiesBanner!.querySelectorAll("button");
    const hasCookie: string | undefined = this.getCookie(cookieName);

    if (!hasCookie) {
      $cookiesBanner!.classList.remove("hidden");
    };
    console.log('cookieTest = ', $cookiesBannerButton, typeof $cookiesBannerButton, document.readyState, $cookiesBanner);

    $cookiesBannerButton.forEach((button: any) => {
      button.addEventListener("click", () => {
        console.log('got here', button, '\n', button.id);
        if (button.id === "accept-button") {
          this.setCookie(cookieName, "accepted", "None", "true", `${window.location}`);
          $cookiesBanner!.remove();
        } else if (button.id === "decline-button") {
          this.setCookie(cookieName, "declined", "None", "true", `${window.location}`);
          $cookiesBanner!.remove();
        } else if (button.id === "info-button") {
          this.router.navigate(['/home/policies/cookies']);
        };
      });
    });
  };

  ngAfterViewInit(): void {
    this.userCookie();
  };
};


