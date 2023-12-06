import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../Environment/environment';


@Injectable({
  providedIn: 'root'
})
export class DisplayService {

  baseUrl:string = '/api/File/getData';

  constructor(private http:HttpClient) { }

  getdata(keyword:string){
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${env.apirooturl}${this.baseUrl}`, '"' + keyword + '"', { headers });
  }}
