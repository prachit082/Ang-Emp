import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { ToastrService } from 'ngx-toastr';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, EmployeeFormComponent],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  employeeService = inject(EmployeeService);
  employees: Employee[] = [];
  employeeForm = signal(false);
  private readonly toast = inject(ToastrService);

  ngOnInit() {
    this.loadEmployees();
    //this.toast.info('Welcome to Employee Management System', 'Info');
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => this.employees = data,
      error: (e) => console.error(e)
    });
  }

  deleteEmployee(id: string) {
    if(confirm('Are you sure?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        // Refresh list
        this.loadEmployees();
        this.toast.success('Employee removed', 'Success');
      });
    }
  }

  employeeFormToggle() {
    this.employeeForm.set(!this.employeeForm());
  }

  closeForm() {
    this.employeeForm.set(false);
    this.loadEmployees();
  }
}
