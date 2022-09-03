import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL =' http://localhost:9000/api/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(API_URL + 'v1/login', {
      email,
      password
    }, httpOptions);
  }

  generateUserToken(email: string, password: string): Observable<any> {
    return this.http.post(API_URL + 'v1/login/user/token', {
      email,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string, address: string): Observable<any> {
    return this.http.post(API_URL + 'v2/signup', {
      username,
      email,
      password,
      address
    }, httpOptions);
  }

  addUserContent(taskId: number, taskName:string,taskDescription:string,taskDueDate:string, taskPriority: string, taskCategory: string, email: string): Observable<any> {
    return this.http.post(API_URL + 'v2/user/'+email+'/task',{
      taskId,
      taskName,
      taskDescription,
      taskDueDate,
      taskPriority,
      taskCategory
    }, httpOptions);
  }

  updateUserTaskContent(taskName: string,taskDescription:string,taskDueDate:string, taskPriority: string, taskCategory: string, email: string, taskId:number): Observable<any> {
    return this.http.put(API_URL + 'v2/user/'+email+'/'+taskId, { 
      taskName,
      taskDescription,
      taskDueDate,
      taskPriority,
      taskCategory
     }, httpOptions);
  }

  statusOfTask(email: string, taskId: number, taskStatus: boolean): Observable<any> {
    return this.http.post(API_URL + 'v2/user/'+email+'/'+taskId+'/'+taskStatus,{
      email,
      taskId,
      taskStatus
    }, httpOptions);
  }

  getUserTaskContent(email: string): Observable<any> {
    return this.http.get(API_URL + 'v2/user/'+email+'/task', { responseType: 'text' });
  }

  deleteUserTaskContentById(email: string, id: number): Observable<any> {
    return this.http.delete(API_URL + 'v2/user/'+email+'/'+id, { responseType: 'text' });
  }

  addUserLabel(label: string, email: string): Observable<any> {
    console.log(label);
    return this.http.post(API_URL + 'v2/user/'+email+'/label',{
      label
    }, httpOptions);
  }

  getUserLabelContent(email: string): Observable<any> {
    return this.http.get(API_URL + 'v2/user/'+email+'/label', { responseType: 'text' });
  }

}
