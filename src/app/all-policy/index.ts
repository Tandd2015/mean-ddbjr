import { AllPolicyComponent } from "./all-policy.component";
import { ApCookiePolicyComponent } from "./ap-cookie-policy/ap-cookie-policy.component";
import { ApPrivacyPolicyComponent } from "./ap-privacy-policy/ap-privacy-policy.component";
import { ApServiceTermsPolicyComponent } from "./ap-service-terms-policy/ap-service-terms-policy.component";

export const components: any[] = [
  AllPolicyComponent,
  ApCookiePolicyComponent,
  ApPrivacyPolicyComponent,
  ApServiceTermsPolicyComponent
]

export * from "./all-policy.component";
export * from "./ap-cookie-policy/ap-cookie-policy.component";
export * from "./ap-privacy-policy/ap-privacy-policy.component";
export * from "./ap-service-terms-policy/ap-service-terms-policy.component";
