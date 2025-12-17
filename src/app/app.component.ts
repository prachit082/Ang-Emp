import { Component } from '@angular/core';
import { EmployeeListComponent } from "./pages/employee-list/employee-list.component";

@Component({
  selector: 'app-root',
  imports: [EmployeeListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
