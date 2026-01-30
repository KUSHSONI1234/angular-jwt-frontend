import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  imports: [],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {
  activeUsersCount: number = 0; 

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.loadActiveUsersCount();
  }

  loadActiveUsersCount() {
    this.dashboardService.getActiveUsersCount().subscribe({
      next: (res) => {
        this.activeUsersCount = res.activeUsers;
      },
      error: (err) => {
        console.error('Dashboard count error', err);
      },
    });
  }

  


}
