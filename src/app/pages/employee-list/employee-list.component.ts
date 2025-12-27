import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { ToastrService } from 'ngx-toastr';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, EmployeeFormComponent, FormsModule],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  employeeService = inject(EmployeeService);
  employees: Employee[] = [];
  searchEmployees: Employee[] = [];
  employee: Employee;
  employeeForm = signal(false);
  employeeEditForm = signal(false);
  private readonly toast = inject(ToastrService);

  @ViewChild('employeeEdit') employeeEdit: NgForm;

  ngOnInit() {
    this.loadEmployees();
    //this.toast.info('Welcome to Employee Management System', 'Info');
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => ((this.employees = data), (this.searchEmployees = data)),
      error: (e) => console.error(e),
    });
  }

  filterEmployees(searchTerm: string) {
    if (!searchTerm) {
      this.employees = this.searchEmployees;
    } else {
      const term = searchTerm.toLowerCase();
      this.employees = this.searchEmployees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(term) ||
          emp.email.toLowerCase().includes(term) ||
          emp.position.toLowerCase().includes(term) ||
          emp.department.toLowerCase().includes(term)
      );
    }
  }

  getEmployeeByIdToDelete(id: string) {
    this.employeeService.getEmployee(id).subscribe({
      next: (data) => {
        this.employee = data;
        this.deleteEmployee(id);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getEmployeeByIdToUpdate(id: string) {
    this.employeeService.getEmployee(id).subscribe({
      next: (data) => {
        this.employee = data;
        this.employeeEditForm.set(true);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  updateEmployee() {
    this.employeeService
      .updateEmployee(this.employee._id!, this.employee)
      .subscribe({
        next: (res) => {
          this.toast.success(
            `${this.employee.name}'s details updated!`,
            'Success'
          );
          this.loadEmployees();
        },
        error: (err) => {
          console.log(err);
          this.toast.error('Cannot Update', 'Error');
        },
      });
    this.employeeEditForm.set(false);
  }

  deleteEmployee(id: string) {
    const isConfirmed = confirm(
      `Are you sure you want to remove ${this.employee?.name}?`
    );
    if (isConfirmed) {
      this.employeeService.deleteEmployee(id).subscribe((deletedEmp: any) => {
        // Refresh list
        this.loadEmployees();
        this.toast.success(`${deletedEmp.name} was removed`, 'Success');
      });
    }
  }

  exportToCsv() {
    const headers = [
      'Name',
      'Email',
      'Contact',
      'Position',
      'Department',
      'Salary',
    ];

    const csvRows = this.employees.map((emp) => {
      return [
        emp.name,
        emp.email,
        emp.contact || '',
        emp.position,
        emp.department || '',
        emp.salary || 0,
      ]
        .map((value) => {
          const stringValue = String(value).replace(/"/g, '""');
          return `"${stringValue}"`;
        })
        .join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Employees_${new Date()
      .toLocaleDateString('en-GB')
      .replace(/\//g, '-')}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  employeeFormToggle() {
    this.employeeForm.set(!this.employeeForm());
  }

  employeeEditFormToggle() {
    this.employeeEditForm.set(!this.employeeEditForm());
  }

  closeForm() {
    this.employeeForm.set(false);
    this.loadEmployees();
  }

  onInputDigitsOnly(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const digitsOnly = /^\d+$/;

    if (!digitsOnly.test(inputValue)) {
      inputElement.setCustomValidity('');
      inputElement.reportValidity();
      inputElement.checkValidity();
      return false;
    } else {
      inputElement.setCustomValidity('');
      inputElement.reportValidity();
      inputElement.checkValidity();
      return true;
    }
  }

  onInputAlphabetsOnly(event: any) {
    const input = event.target.value;
    const alphabeticInput = input.replace(/[^a-z A-Z]/g, ''); // Keep only alphabetic characters
    event.target.value = alphabeticInput; // Update the input value

    if (input !== alphabeticInput) {
      this.toast.warning('Use Alphabetic Characters', 'Alert');
    }
  }

  onInputNumbersOnly(event: any) {
    const input = event.target.value;
    const numericInput = input.replace(/[^0-9]/g, ''); // Keep only numeric characters
    event.target.value = numericInput; // Update the input value

    if (input !== numericInput) {
      this.toast.warning('Use Numbers', 'Alert');
    }
  }
}
