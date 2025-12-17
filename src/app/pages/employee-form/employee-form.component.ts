import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-form.component.html',
})
export class EmployeeFormComponent {
  employeeService = inject(EmployeeService);
  router = inject(Router);
  private readonly toast = inject(ToastrService);

  Employee: Employee;
  newEmployee: Employee = new Employee();
  @ViewChild('employeeForm') employeeForm: NgForm;
  @Output() onClose = new EventEmitter<void>();

  onSubmit= async () => {
    const employeeForm = this.newEmployee;
    if (this.employeeForm.valid) {
      this.employeeService.createEmployee(employeeForm).subscribe({
        next: () => {
          this.toast.success('Employee Added', 'Success');
          this.employeeForm.resetForm();
          this.onClose.emit();
        },
        error: (err) => {
          this.toast.error(`Cannot Add - ${err}`, 'Error');
        },
      });
    }
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
