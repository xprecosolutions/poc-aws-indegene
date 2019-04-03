import { Component, OnInit } from '@angular/core';
import { TestReport } from '../_models/testreport';
import { ProductService } from '../products/product.service';
import { ContentChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-testreports',
  templateUrl: './testreports.component.html',
  styleUrls: ['./testreports.component.scss']
})
export class TestreportsComponent implements OnInit {
  @ContentChild(NgbPagination) pagination: NgbPagination;
  reports = null;
  pageSize = 5;
  page = 1;
  collectionSize = 10;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getTestReports();
    this.page = 1;
    this.pageSize = 5;
    //this.collectionSize = this.reports.length;
  }

  getTestReports(): void {
    this.productService.getTestReports().subscribe( reports => this.reports = reports );
    //this.collectionSize = products.len;
  }
}
