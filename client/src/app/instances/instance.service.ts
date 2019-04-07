import { Injectable, Inject } from '@angular/core';
import {Instance} from './instance';
import {TestReport} from '../_models/testreport';
import { INSTANCES } from './mock-instances';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  constructor(
  private http: HttpClient,
  @Inject(APP_CONFIG) private config: AppConfig) {
  }

  getInstances(): Observable<Instance[]> {
    //return of(InstanceS);
    return this.http.get<Instance[]>(`${this.config.apiEndpoint}/instances`)
  }

  getInstancesForBu(bu): Observable<Instance[]> {
    //return of(InstanceS);
    return this.http.get<Instance[]>(`${this.config.apiEndpoint}/instances?business_unit=${bu}`)
  }

  getInstance(region,id): Observable<Instance> {
    console.log(id);
    //return of(InstanceS[id-1]);
    return this.http.get<Instance>(`${this.config.apiEndpoint}/instances?region=${region}&instanceid=${id}`)
  }

  addTag(region,id,key, value): Observable<Instance> {
    console.log(region);
    console.log(id);
    console.log(key);
    console.log(value);
    return this.http.post<Instance>(`${this.config.apiEndpoint}/instances?region=${region}&instanceid=${id}&key=${key}&value=${value}`)
  }

}
