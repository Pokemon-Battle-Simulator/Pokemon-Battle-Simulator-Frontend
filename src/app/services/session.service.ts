import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Session, Status } from '../models/session';
import { url } from 'src/environments/environment';
import { filter, Observable, take } from 'rxjs';

const sessionUrl = url + '/sessions'

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) { }

  getSession(id: number): Observable<Session> {
    return this.http.get<Session>(`${sessionUrl}/get/${id}`);
  }

  joinSession(): Observable<Session> {
    return this.http.get<Session>(`${sessionUrl}/findAll`, this.httpOptions).pipe(
      filter(ses => ses.user1_status == Status.EMPTY || ses.user2_status == Status.EMPTY)
    );
  }

  createSession(session: Session): Observable<Session> {
    return this.http.post<Session>(`${sessionUrl}/add`, session, this.httpOptions);
  }

  updateSessionUserOnly(session: Session, user_id: number): Observable<Session> {
    return this.http.post<Session>(`http://localhost:5000/session/update/${user_id}`, session, this.httpOptions);
  }

  updateSession(session: Session) {
    return this.http.post<Session>(`http://localhost:5000/session/update`, session, this.httpOptions);
  }
}
