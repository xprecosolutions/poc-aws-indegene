import { Component, OnInit } from '@angular/core';
import { TestReport } from '../_models/testreport';
import { Entity } from '../_models/entity';
import { EntityService } from '../_services/entity.service';
import { ContentChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { switchMap, every, filter } from 'rxjs/operators';

@Component({
  selector: 'app-testlabs',
  templateUrl: './testlabs.component.html',
  styleUrls: ['./testlabs.component.scss']
})
export class TestlabsComponent implements OnInit {
  @ContentChild(NgbPagination) pagination: NgbPagination;
  reports = null;
  _reports$:  Observable<Entity[]>;
  source : Entity[];
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
    this._reports$ = this.entityService.getEntities();
    this.entityService.getEntities().subscribe( vals => this.reports  = vals.filter( entity => entity.type === "Testing And Certification Labs"));
    //this.entityService.getEntities().pipe(every( val => val.type === "Testing And Certification Labs")).subscribe( reports => this.reports = reports );
    //this.entityService.getEntities().of().pipe(every( val => val.type === "Testing And Certification Labs")).subscribe( reports => this.reports = reports );
    //of(this.entityService.getEntities()).pipe( every ( val => val.type === "Testing And Certification Labs"))
    //this.entityService.getEntities().pipe(filter( val => val.type === "Testing And Certification Labs")).subscribe( reports => this.reports = reports );
  }
}
