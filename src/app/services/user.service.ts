import { User } from './../models/user';
import { url } from '../../environments/environment'
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const userUrl = url + '/users'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private http: HttpClient) { }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${userUrl}/register`, user, this.httpOptions)
  }

  logInUser(username:string, password:string): Observable<any> {
    console.log(username + ' ' + password)

    const payload = { username, password}

    return this.http.post<any>(`${userUrl}/login`, payload, {observe: 'response'})
  }
}
