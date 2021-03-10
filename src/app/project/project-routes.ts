import { Routes } from '@angular/router';

import { CommentingTabComponent } from './commenting-tab/commenting-tab.component';
import { DecisionsTabComponent } from './decisions-tab/decisions-tab.component';
import { CommentsComponent } from 'app/comments/comments.component';
import { DocumentsTabComponent } from './documents/documents-tab.component';
import { DocumentsResolver } from './documents/documents-resolver.service';
import { ProjectDetailsTabComponent } from './project-details-tab/project-details-tab.component';
import { ProjectActivitiesResolver } from './project-activites/project-activities-resolver.service';
import { DocumentTableResolver } from './documents/project-document-table-rows/project-document-table-rows-resolver.service';
import { CertificatesResolver } from './certificates/certificates-resolver.service';
import { CertificatesComponent } from './certificates/certificates.component';
import { AmendmentsResolverService } from './certificates/amendments-resolver.service';
import { PinsResolverService } from './pins/pins-resolver.service';
import { FeaturedDocumentsResolverService } from './featured-documents/featured-documents-resolver.service';
import { ApplicationComponent } from './application/application.component';
import { ApplicationResolver } from './application/application-resolver.service';

export const ProjectRoutes: Routes = [
  {
    path: '',
    redirectTo: 'project-details',
    pathMatch: 'full'
  },
  {
    path: 'project-details',
    component: ProjectDetailsTabComponent,
    resolve: {
      ProjectActivitiesResolver,
      PinsResolverService,
      FeaturedDocumentsResolverService
    }
  },
  {
    path: 'certificates',
    component: CertificatesComponent,
    resolve: {
      CertificatesResolver,
    }
  },
  {
    path: 'amendments',
    component: CertificatesComponent,
    resolve: {
      documents: AmendmentsResolverService,
      documentsTableRow: DocumentTableResolver
    }
  },
  {
    path: 'application',
    component: ApplicationComponent,
    resolve: {
      ApplicationResolver
    }
  },
  {
    path: 'commenting',
    component: CommentingTabComponent
  },
  {
    path: 'documents',
    component: DocumentsTabComponent,
    resolve: {
      DocumentsResolver
    }
  },
  {
    path: 'decisions',
    component: DecisionsTabComponent
  },
  {
    path: 'cp',
    component: CommentsComponent
  }
];
