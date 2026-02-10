import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { UserComponent } from './components/user/user.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { RoleComponent } from './components/role/role.component';
import { RoleAddComponent } from './components/role-add/role-add.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuAddComponent } from './components/menu-add/menu-add.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },

      // USERS
      {
        path: 'users',
        children: [
          { path: '', component: UserComponent },
          { path: 'add', component: UserAddComponent },
          { path: 'view/:id', component: UserAddComponent },
          { path: 'edit/:id', component: UserAddComponent },
        ],
      },

      // ROLES
      {
        path: 'roles',
        children: [
          { path: '', component: RoleComponent }, // list
          { path: 'add', component: RoleAddComponent }, // create
          { path: 'edit/:id', component: RoleAddComponent },
          { path: 'view/:id', component: RoleAddComponent },
        ],
      },


      {
        path: 'menu',
        children: [
          { path: '', component: MenuComponent }, // list
          { path: 'add', component: MenuAddComponent }, // create
          { path: 'edit/:id', component: MenuAddComponent },
          { path: 'view/:id', component: MenuAddComponent },
        ],
      },

    ],
  },

  { path: '**', redirectTo: 'register' },
];
