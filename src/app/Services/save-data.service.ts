import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {

  baseUrl:string = '/api/File/saveData';
  constructor(private http:HttpClient) { }

  save(data:any){
 return this.http.post(`${env.apirooturl}${this.baseUrl}`,data);   
  }
}
