import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { AppConfigModule } from './app-config.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductsModule } from './products/products.module';
import { AdminComponent } from './admin';
import { LoginComponent} from './login';
import { SearchComponent } from './search/search.component';
import { TestreportsComponent } from './testreports/testreports.component';
import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { TestlabsComponent } from './testlabs/testlabs.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    AdminComponent,
    LoginComponent,
    SearchComponent,
    TestreportsComponent,
    ManufacturersComponent,
    TestlabsComponent
  ],
  imports: [
    BrowserModule,
    AppConfigModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    ProductsModule,
    AppRoutingModule
  ],
  providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
