import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import * as fromPost from './posts';
// import * as fromReview from './testimonials';
// import * as fromServices from './a-services';
import * as fromPolicy from './all-policy';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { environment } from '../environments/environment';

const enableTracing = false && !environment.production;

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home/dash',
    pathMatch: 'full'
  },
  {
    path: 'home',
    children: [
      {
        path: '',
        children: [
          {
            path: 'dash',
            component: HomeComponent
          },
          {
            path: 'policies',
            component: fromPolicy.AllPolicyComponent
          },
          {
            path: 'policies/cookies',
            component: fromPolicy.ApCookiePolicyComponent
          },
          {
            path: 'policies/privacy',
            component: fromPolicy.ApPrivacyPolicyComponent
          },
          {
            path: 'policies/service-terms',
            component: fromPolicy.ApServiceTermsPolicyComponent
          },
          // {
          //   path: 'posts',
          //   component: fromPost.PostListComponent
          // },
          // {
          //   path: 'reviews',
          //   component: fromReview.TestimonialListComponent
          // },
          // {
          //   path: 'investigations',
          //   component: fromServices.InvestigationListComponent
          // },
          // {
          //   path: 'investigation/details/:id',
          //   component: fromServices.InvestigationDetailComponent
          // },
          // {
          //   path: 'security-surveillance',
          //   component: fromServices.SecuritySurveillanceListComponent
          // },
          // {
          //   path: 'security/details/:id',
          //   component: fromServices.SecuritySurveillanceDetailComponent
          // },
          // {
          //   path: 'surveillance/details/:id',
          //   component: fromServices.SecuritySurveillanceDetailComponent
          // },
        ]
      }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing,
  })
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
