import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './employee-form.component.html',
})
export class EmployeeFormComponent {
  fb = inject(FormBuilder);
  http = inject(EmployeeService);
  router = inject(Router);

  employeeForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    position: ['', Validators.required],
    department: [''],
    salary: [0]
  });

  onSubmit() {
    if (this.employeeForm.valid) {
      this.http.createEmployee(this.employeeForm.value as any).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
