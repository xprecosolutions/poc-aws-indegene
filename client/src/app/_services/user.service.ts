import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models';


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        //return this.http.get<User[]>(`${config.apiUrl}/users`);
        return this.http.get<User[]>(`${environment.apiEndpoint}/users`);
    }

    getById(id: number) {
        //return this.http.get<User>(`${config.apiUrl}/users/${id}`);
        return this.http.get<User>(`${environment.apiEndpoint}/users/${id}`);
    }
}
