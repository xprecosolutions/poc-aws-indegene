import { Injectable, Inject } from '@angular/core';
import {Product} from './product';
import {TestReport} from '../_models/testreport';
import { PRODUCTS } from './mock-products';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
  private http: HttpClient,
  @Inject(APP_CONFIG) private config: AppConfig) {
  }

  getProducts(): Observable<Product[]> {
    //return of(PRODUCTS);
    return this.http.get<Product[]>(`${this.config.apiEndpoint}/channels/b2bchannel/chaincodes/products`)
  }

  getProduct(id): Observable<Product> {
    console.log(id);
    //return of(PRODUCTS[id-1]);
    return this.http.get<Product>(`${this.config.apiEndpoint}/channels/b2bchannel/chaincodes/products/${id}`)
  }

  getTestReport(id): Observable<TestReport> {
    console.log(id);
    //return of(PRODUCTS[id-1]);
    return this.http.get<TestReport>(`${this.config.apiEndpoint}/channels/b2bchannel/chaincodes/testreports/${id}`)
  }

  getTestReports(): Observable<TestReport[]> {
    //return of(PRODUCTS[id-1]);
    return this.http.get<TestReport[]>(`${this.config.apiEndpoint}/channels/b2bchannel/chaincodes/testreports`)
  }

}
