import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstancesComponent } from './instance-list/instances.component';
import { InstanceDetailComponent } from './instance-detail/instance-detail.component';
import { InstancesRoutingModule } from './instances-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InstancesComponent,
    InstanceDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    InstancesRoutingModule
  ]
})
export class InstancesModule { }
