import { Injectable } from '@angular/core';
//import { resolve } from 'dns';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { map, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]> {
    //return Promise.resolve(LEADERS);
    /*return new Promise(
      resolve => {
        setTimeout(() => resolve(LEADERS), 200)
      }
    );*/
    //return of(LEADERS).pipe(delay(2000));
    return this.http.get<Leader[]>(baseURL + 'leadership')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeader(id: string): Observable<Leader> {
    //return Promise.resolve(LEADERS.filter((leader) => (leader.id === id))[0]);
    /*return new Promise(
      resolve => {
        setTimeout(() => resolve((LEADERS.filter((leader) => (leader.id === id))[0])), 200)
      }
    );*/
    //return of(LEADERS.filter((leader) => (leader.id === id))[0]).pipe(delay(2000));
    return this.http.get<Leader>(baseURL + 'leadership/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedLeader(): Observable<Leader> {
    //return Promise.resolve(LEADERS.filter((leader) => leader.featured)[0]);
    /*return new Promise(
      resolve => {
        setTimeout(() => resolve((LEADERS.filter((leader) => leader.featured)[0])), 200)
      }
    );*/
    //return of(LEADERS.filter((leader) => leader.featured)[0]).pipe(delay(2000));
    return this.http.get<Leader[]>(baseURL + 'leadership?featured=true').pipe(map(leadership => leadership[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
