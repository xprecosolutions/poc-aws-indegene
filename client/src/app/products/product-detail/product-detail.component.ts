import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {Product} from '../product';
import {ProductService} from '../product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  //@Input() product: Product;
  //product: Product;
  product$: Observable<Product>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getProduct();
  }
  getProduct(): void {
    console.log('getProduct() called');

    this.product$ = this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.productService.getProduct(params.get('id')))
      );

  }

  goBack(): void {
    this.location.back();
  }

}
