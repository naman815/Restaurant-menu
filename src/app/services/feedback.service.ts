import { Injectable } from "@angular/core";
import { Feedback } from "../shared/feedback";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { baseURL } from "../shared/baseURL";
import { map, catchError } from "rxjs/operators";
import { ProcessHTTPMsgService } from "./process-httpmsg.service";
import { error } from "protractor";

@Injectable({
  providedIn: "root",
})
export class FeedbackService {
  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) {}

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http
      .post<Feedback>(baseURL + "feedback/", feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
