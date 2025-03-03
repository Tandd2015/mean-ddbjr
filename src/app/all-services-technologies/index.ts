import { AllServicesTechnologiesComponent } from './all-services-technologies.component';
import { ServiceDetailComponent } from './services/service-detail/service-detail.component';
import { ServiceListComponent } from './services/service-list/service-list.component';
import { TechnologyDetailComponent } from './technologies/technology-detail/technology-detail.component';
import { TechnologyListComponent } from './technologies/technology-list/technology-list.component';

export const components: any[] = [
  AllServicesTechnologiesComponent,
  ServiceDetailComponent,
  ServiceListComponent,
  TechnologyDetailComponent,
  TechnologyListComponent
];

export * from './all-services-technologies.component';
export * from './services/service-detail/service-detail.component';
export * from './services/service-list/service-list.component';
export * from './technologies/technology-detail/technology-detail.component';
export * from './technologies/technology-list/technology-list.component';
