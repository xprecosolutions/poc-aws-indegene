import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard }                from '../_auth/auth.guard';
import { User, Role } from '../_models';
import { InstancesComponent } from './instance-list/instances.component';
import { InstanceDetailComponent } from './instance-detail/instance-detail.component';

/*
const routes: Routes = [
  {
      path: 'Instances',
      component: InstancesComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  },

  { path: 'Instance/:id', component: InstanceDetailComponent },
  { path: 'Instances', component: InstancesComponent }
];

const routes: Routes = [
  {
    path: 'Instances',
    component: InstancesComponent,
    children: [
      {
        path: '',
        children: [
          { path: 'Instance/:id', component: InstanceDetailComponent },
          { path: '', component: InstancesComponent }
        ],
      }
    ]
  }
];
*/
const routes: Routes = [
  {
      path: 'instances',
      component: InstancesComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  },
  {
      path: 'instances/:business_unit',
      component: InstancesComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  },
  {
      path: 'instance/:region/:id',
      component: InstanceDetailComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstancesRoutingModule { }
