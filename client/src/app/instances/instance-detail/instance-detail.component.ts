import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Observable, Subject, from , of} from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Instance} from '../instance';
import {InstanceService} from '../instance.service';

@Component({
  selector: 'app-instance-detail',
  templateUrl: './instance-detail.component.html',
  styleUrls: ['./instance-detail.component.scss']
})
export class InstanceDetailComponent implements OnInit {

  //@Input() instance: Instance;
  //instance: Instance;
  instance$: Observable<Instance>;
  searchForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private instanceService: InstanceService,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
        productid: ['', Validators.required],
        value: ['', Validators.required]
    });

    this.getInstance();
    this.addTags = false;
  }
  getInstance(): void {
    console.log('getInstance() called');

    this.instance$ = this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.instanceService.getInstance(params.get('region'),params.get('id')))
      );

  }

  goBack(): void {
    this.location.back();
  }
  addTag(): void {
    this.addTags = true;
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
      console.log('onSubmit(): ' + this.f.value.value)

/*
      this.instance$ = this.route.paramMap.pipe(
          switchMap((params: ParamMap) =>
            this.instanceService.addTag(params.get('region'),params.get('id'),this.f.productid.value,this.f.value.value)
        ));
*/

      this.instanceService.addTag(this.route.snapshot.paramMap.get("region"),this.route.snapshot.paramMap.get("id"),this.f.productid.value,this.f.value.value).subscribe( (data) => {
        console.log(data);
        this.instance$ = of(data);
        this.loading = false;
        this.addTags = false;
        this.getInstance();
        //this.router.navigate(['/instances/' + this.instance.region + '/' + this.instance.id]);
      });
      /*
      this.productService.getProduct(this.f.productid.value).subscribe( (data) => {
        console.log(data);
        this.product$ = of(data);
        this.productService.getTestReport(data.report).subscribe((data) => {
          console.log(data)
          //this.product = product;
          this.report$ = of(data);
          this.loading = false;
        });
      });*/

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
