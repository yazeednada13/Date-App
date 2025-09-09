import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from '../features/messages/messages.component';
import { authGuard } from '../core/_guards/auth.guard';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberListComponent } from '../features/members/member-list/member-list.component';
import { MemberDetailComponent } from '../features/members/member-detail/member-detail.component';
import { TestErrors } from '../features/test-errors/test-errors';
import { MemberPhotos } from '../features/members/member-photos/member-photos';
import { MemberProfile } from '../features/members/member-profile/member-profile';
import { MemberMessages } from '../features/members/member-messages/member-messages';
import { memberResolver } from '../features/members/member-resolver';
import { preventUnsavedChangesGuard } from '../core/_guards/prevent-unsaved-changes-guard';
import { Admin } from '../features/admin/admin';
import { adminGuard } from '../core/_guards/admin-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'members',
        component: MemberListComponent,
      },
      {
        path: 'members/:id',
        resolve: { member: memberResolver },
        runGuardsAndResolvers: 'always',
        component: MemberDetailComponent,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          {
            path: 'profile',
            component: MemberProfile,
            title: 'Profile',
            canDeactivate: [preventUnsavedChangesGuard],
          },
          { path: 'photos', component: MemberPhotos, title: 'Photos' },
          { path: 'messages', component: MemberMessages, title: 'Messages' },
        ],
      },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'admin', component: Admin, canActivate: [adminGuard] },
    ],
  },

  { path: 'errors', component: TestErrors },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent },
];
