import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  isDropdownOpen = signal(false);
  private router = inject(Router);

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  logout() {
    alert('Logged out successfully');
    this.isDropdownOpen.set(false);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  isEmployeesActive(): boolean {
    return this.router.isActive('/employees', true);
  }
}
