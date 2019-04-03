import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, first, mergeMap } from 'rxjs/operators';
import { Observable, Subject, from , of} from 'rxjs';
import {ProductService} from '../products/product.service';
import {Product} from '../products/product';
import {TestReport} from '../_models/testreport';

import { AuthenticationService } from '../_services';

@Component({ templateUrl: 'search.component.html' })
export class SearchComponent implements OnInit {
    searchForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    product$: Observable<Product>;
    report$: Observable<TestReport>;

    //private searchTerms = new Subject<string>();

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private productService: ProductService
    ) {
        // redirect to home if already logged in
        /*
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }*/
    }

    // Push a search term into the observable stream.
    /*
    search(term: string): void {
      this.searchTerms.next(term);
    }*/


    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            productid: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        /*this.product$ = this.searchTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),

            // ignore new term if same as previous term
            distinctUntilChanged(),

            // switch to new search observable each time the term changes
            switchMap((productid: string) => this.heroService.searchHeroes(productid)),
          );*/
    }

    // convenience getter for easy access to form fields
    get f() { return this.searchForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.searchForm.invalid) {
            return;
        }
        this.loading = true;
        console.log('onSubmit(): ' + this.f.productid.value)
        //this.product$ = this.productService.getProduct(this.f.productid.value);
        //this.productService.getProduct(this.f.productid.value)
        //  .subscribe( prod => this.product = prod);
        //this.product$.subscribe(event => this.loading = false )
        /*this.product$.subscribe({
          next(response) { console.log(response);},
          error(err) { console.error('Error: ' + err); },
          complete() { console.log('Completed'); }
        });*/
        //this.testreport$ = this.productService.getTestReport(this.product.report);

        /*this.http.get('/api/people/1').subscribe(character => {
          this.http.get(character.homeworld).subscribe(homeworld => {
            character.homeworld = homeworld;
            this.loadedCharacter = character;
          });
        });*/
        this.productService.getProduct(this.f.productid.value).subscribe( (data) => {
          console.log(data);
          this.product$ = of(data);
          this.productService.getTestReport(data.report).subscribe((data) => {
            console.log(data)
            //this.product = product;
            this.report$ = of(data);
            this.loading = false;
          });
        });
        /*
        this.report = this.productService.getProduct(this.f.productid.value).pipe(
          mergeMap(product => this.productService.getTestReport(product.report))
        );
        */

        /*

        this.navStart.subscribe()
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
                */
    }
}
