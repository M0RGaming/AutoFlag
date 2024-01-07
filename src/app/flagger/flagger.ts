import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlaggerService {

  private apiUrl = 'http://server.cpatil.ca:5000/moderate';

  constructor(private http: HttpClient) { }

  moderateText(prompt: string): Observable<any> {
    // Set up headers and request payload
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const requestBody = {
      prompt: prompt
    };

    // Make the request to the Flask API
    return this.http.post<any>(this.apiUrl, requestBody, { headers });
  }
}
