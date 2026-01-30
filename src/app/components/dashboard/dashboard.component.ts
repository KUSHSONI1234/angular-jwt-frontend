import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, RouterOutlet, FormsModule, CommonModule], // optional for standalone
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // corrected
})
export class DashboardComponent {
  username = localStorage.getItem('username');
  roleName = localStorage.getItem('roleName'); 

  activeUsersCount: number = 0; // 👈 for card
  isMasterOpen = false;

  constructor(
    public router: Router,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
  ) {}

  // ngOnInit(): void {
  //   if (this.router.url.includes('/dashboard/users')) {
  //     this.isMasterOpen = true;
  //   }
  //   this.loadActiveUsersCount();
  // }

  // loadActiveUsersCount() {
  //   this.dashboardService.getActiveUsersCount().subscribe({
  //     next: (res) => {
  //       this.activeUsersCount = res.activeUsers;
  //     },
  //     error: (err) => {
  //       console.error('Dashboard count error', err);
  //     },
  //   });
  // }

  toggleMaster() {
    this.isMasterOpen = !this.isMasterOpen;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
