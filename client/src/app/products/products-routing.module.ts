import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard }                from '../_auth/auth.guard';
import { User, Role } from '../_models';
import { ProductsComponent } from './product-list/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

/*
const routes: Routes = [
  {
      path: 'products',
      component: ProductsComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  },

  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'products', component: ProductsComponent }
];

const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      {
        path: '',
        children: [
          { path: 'product/:id', component: ProductDetailComponent },
          { path: '', component: ProductsComponent }
        ],
      }
    ]
  }
];
*/
const routes: Routes = [
  {
      path: 'products',
      component: ProductsComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  },
  {
      path: 'product/:id',
      component: ProductDetailComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
