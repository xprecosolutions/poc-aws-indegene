import { Component, OnInit } from '@angular/core';
import { Instance } from '../instance';
import { InstanceService } from '../instance.service';
import { ContentChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.scss']
})
export class InstancesComponent implements OnInit {
  @ContentChild(NgbPagination) pagination: NgbPagination;
  instances = [];
  pageSize = 5;
  page = 1;
  selectedInstance = Instance;
  collectionSize = 10;
  business_unit = '';

  constructor(private route: ActivatedRoute,private instanceService: InstanceService) { }

  ngOnInit() {
    this.business_unit = this.route.snapshot.paramMap.get("business_unit");
    console.log(this.business_unit);

    this.getInstances();
    this.page = 1;
    this.pageSize = 5;
    this.collectionSize = this.instances.length;
  }

  onSelect(instance: Instance): void {
    //this.selectedInstance = instance;
    console.log('Clicked...');
    console.log(instance);
  }

  getInstances(): void {
    console.log(this.business_unit);
    if (this.business_unit)
      this.instanceService.getInstancesForBu(this.business_unit).subscribe( instances => this.instances = instances );
    else
      this.instanceService.getInstances().subscribe( instances => this.instances = instances );

    //this.collectionSize = instances.len;
  }



}
