import {
  Component,
  inject,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { DashboardStats } from '../../models/dashboard.model';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  http = inject(EmployeeService);
  cd = inject(ChangeDetectorRef);
  stats: DashboardStats;

  @ViewChild('deptChart') deptChartRef!: ElementRef;
  @ViewChild('positionChart') positionChartRef!: ElementRef;

  ngOnInit() {
    this.fetchStats();
  }

  fetchStats() {
    this.http.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.cd.detectChanges();
        this.renderCharts();
      },
      error: (err) => console.error(err),
    });
  }

  renderCharts() {
    if (!this.stats) return;

    // 1. Pie Chart for Departments
    const deptLabels = this.stats.deptStats.map((d) => d._id || 'Unknown');
    const deptData = this.stats.deptStats.map((d) => d.count);

    new Chart(this.deptChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: deptLabels,
        datasets: [
          {
            data: deptData,
            backgroundColor: [
              '#3B82F6',
              '#10B981',
              '#F59E0B',
              '#EF4444',
              '#8B5CF6',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });

    // 2. Bar Chart for Positions
    const posLabels = this.stats.positionStats.map((p) => p._id);
    const posData = this.stats.positionStats.map((p) => p.count);

    new Chart(this.positionChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: posLabels,
        datasets: [
          {
            label: 'Employees per Position',
            data: posData,
            backgroundColor: '#3B82F6',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
      },
    });
  }

  redirectToEmployees() {
    window.location.href = '/employees';
  }
}
