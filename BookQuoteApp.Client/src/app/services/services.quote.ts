import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Quote {
  id: number;
  text: string;
  author: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'https://bookquote.onrender.com';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getQuote(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createQuote(quote: { text: string; author: string }): Observable<Quote> {
    return this.http.post<Quote>(this.apiUrl, quote, { headers: this.getHeaders() });
  }

  updateQuote(id: number, quote: { text: string; author: string }): Observable<Quote> {
    return this.http.put<Quote>(`${this.apiUrl}/${id}`, quote, { headers: this.getHeaders() });
  }

  deleteQuote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
