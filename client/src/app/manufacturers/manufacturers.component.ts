import { Component, OnInit } from '@angular/core';
import { TestReport } from '../_models/testreport';
import { EntityService } from '../_services/entity.service';
import { ContentChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.scss']
})
export class ManufacturersComponent implements OnInit {
  @ContentChild(NgbPagination) pagination: NgbPagination;
  reports = null;
  pageSize = 5;
  page = 1;
  collectionSize = 10;

  constructor(private entityService: EntityService) { }

  ngOnInit() {
    this.getEntities();
    this.page = 1;
    this.pageSize = 5;
  }

  getEntities(): void {
    //this.entityService.getEntities().subscribe( reports => this.reports = reports );
    this.entityService.getEntities().subscribe( vals => this.reports  = vals.filter( entity => entity.type === "Manufacturer"));

  }
}
