import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from '../user-list/user-list.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserManagementComponent } from '../user-management/user-management.component';


const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent },
  { path: 'users/:id', component: UserDetailsComponent },
  { path: 'userslist', component: UserFormComponent },
  { path: 'UserManagement', component: UserManagementComponent},

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
