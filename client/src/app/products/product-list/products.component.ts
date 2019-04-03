import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { ContentChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ContentChild(NgbPagination) pagination: NgbPagination;
  products = null;
  pageSize = 5;
  page = 1;
  selectedProduct = Product;
  collectionSize = 10;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getProducts();
    this.page = 1;
    this.pageSize = 5;
    this.collectionSize = this.products.length;
  }

  onSelect(product: Product): void {
    //this.selectedProduct = product;
    console.log('Clicked...');
    console.log(product);
  }

  getProducts(): void {
    this.productService.getProducts().subscribe( products => this.products = products );
    //this.collectionSize = products.len;
  }
}
