import { Injectable, Inject } from '@angular/core';
import { Entity} from '../_models/entity';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  constructor(
  private http: HttpClient,
  @Inject(APP_CONFIG) private config: AppConfig) {
  }

  getEntities(): Observable<Entity[]> {
    //return of(PRODUCTS);
    return this.http.get<Entity[]>(`${this.config.apiEndpoint}/channels/b2bchannel/chaincodes/nabl`)
  }

}
