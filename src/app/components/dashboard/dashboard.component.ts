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
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  username = localStorage.getItem('username');
  roleName = localStorage.getItem('roleName');

  activeUsersCount: number = 0; //
  isMasterOpen = false;
  isUtilsOpen = false;

  menus: any[] = [];
  openMenuId: number | null = null;
  constructor(
    public router: Router,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    console.log(
      '🚀 ~ DashboardComponent ~ ngOnInit ~ router.url:',
      this.router.url,
    );
    this.loadMenus();
  }

  loadMenus() {
    this.menuService.getMasterMenus().subscribe({
      next: (res) => {
        this.menus = res;
        console.log(
          '🚀 ~ DashboardComponent ~ loadMenus ~ this.menus:',
          this.menus,
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  toggleMaster() {
    this.isMasterOpen = !this.isMasterOpen;
    this.isUtilsOpen = false;
  }

  toggleUtils() {
    this.isUtilsOpen = !this.isUtilsOpen;
    this.isMasterOpen = false;
  }
  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isMenuActive(menu: any): boolean {
    // Check if current menu is active
    if (menu.link && this.router.url.startsWith(menu.link)) {
      return true;
    }

    // Check if any child is active
    if (menu.children && menu.children.length > 0) {
      return menu.children.some((child: any) =>
        this.router.url.startsWith(child.link),
      );
    }

    return false;
  }

  navigate(link: string) {
    if (link) {
      this.router.navigateByUrl(link);
    }
  }
}
