import { Component, inject, OnInit } from '@angular/core';
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
  employees: Employee[] = [
  {
    _id: "emp001",
    name: "Aarav Sharma",
    email: "aarav.sharma@company.com",
    position: "Software Engineer",
    department: "Engineering",
    salary: 85000,
  },
  {
    _id: "emp002",
    name: "Neha Verma",
    email: "neha.verma@company.com",
    position: "UI/UX Designer",
    department: "Design",
    salary: 72000,
  },
  {
    _id: "emp003",
    name: "Rohit Mehta",
    email: "rohit.mehta@company.com",
    position: "Product Manager",
    department: "Product",
    salary: 98000,
  },
  {
    _id: "emp004",
    name: "Sneha Iyer",
    email: "sneha.iyer@company.com",
    position: "HR Executive",
    department: "Human Resources",
    salary: 60000,
  },
  {
    _id: "emp005",
    name: "Karan Patel",
    email: "karan.patel@company.com",
    position: "QA Engineer",
    department: "Quality Assurance",
    salary: 68000,
  },
  {
    _id: "emp006",
    name: "Pooja Nair",
    email: "pooja.nair@company.com",
    position: "Data Analyst",
    department: "Analytics",
    salary: 75000,
  },
];
  employeeForm = false;
  private readonly toast = inject(ToastrService);

  ngOnInit() {
    //this.loadEmployees();
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
    this.employeeForm = !this.employeeForm;
  }
}
