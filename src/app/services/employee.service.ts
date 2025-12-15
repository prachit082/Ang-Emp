import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Employee } from '../models/employee.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something went wrong.Check your API and Services')
    );
  }

  //Get : Service to fetch all employees
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl + '/api/employees').pipe(catchError(this.handleError));
  }

  //Post : Service to create new employee
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl + '/api/employees', employee).pipe(catchError(this.handleError));
  }

  //Delete : Service to delete employee by id
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/api/employees/' + id).pipe(catchError(this.handleError));
  }
}
