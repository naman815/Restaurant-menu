import { Injectable } from "@angular/core";
import { Leader } from "../shared/leader";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { baseURL } from "../shared/baseURL";
import { map, catchError } from "rxjs/operators";
import { ProcessHTTPMsgService } from "./process-httpmsg.service";
import { error } from "protractor";

@Injectable({
  providedIn: "root"
})
export class LeaderService {
  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) {}
  getLeaders(): Observable<Leader[]> {
    return this.http
      .get<Leader[]>(baseURL + "leadership")
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeader(id: string): Observable<Leader> {
    return this.http
      .get<Leader>(baseURL + "leadership/" + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  getFeaturedLeader(): Observable<Leader> {
    return this.http
      .get<Leader[]>(baseURL + "leadership?featured=true")
      .pipe(map(leaders => leaders[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
