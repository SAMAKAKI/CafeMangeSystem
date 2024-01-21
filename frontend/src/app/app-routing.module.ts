import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { routerGuardGuard } from './guards/router-guard.guard';
import { ManageCategoryComponent } from './components/dialog/manage-category/manage-category.component';
import { CafeComponent } from './components/layouts/cafe/cafe.component';
import { CategoryComponent } from './components/category/category.component';
import { ManageProductComponent } from './components/dialog/manage-product/manage-product.component';
import { ManageOrderComponent } from './components/dialog/manage-order/manage-order.component';
import { BillComponent } from './components/bill/bill.component';
import { ManageUserComponent } from './components/dialog/manage-user/manage-user.component';

const routes: Routes = [
  {path: "", component: HomeComponent, pathMatch: 'full'},
  {path: "cafe", component: CafeComponent, canActivate: [routerGuardGuard], data: { expectedRole: ['admin', 'user'] }, children: [
    {path: 'dashboard', component: DashboardComponent, canActivateChild: [routerGuardGuard], data: { expectedRole: ['admin', 'user'] }},
    {path: 'manage-category', component: ManageCategoryComponent, canActivateChild: [routerGuardGuard], data: { expectedRole: ['admin'] }},
    {path: 'manage-product', component: ManageProductComponent, canActivateChild: [routerGuardGuard], data: { expectedRole: ['admin'] }},
    {path: 'manage-order', component: ManageOrderComponent, canActivateChild: [routerGuardGuard], data: { expectedRole: ['admin', 'user'] }},
    {path: 'bill', component: BillComponent, canActivateChild: [routerGuardGuard], data: { expectedRole: ['admin', 'user'] }},
    {path: 'manage-user', component: ManageUserComponent, canActivateChild: [routerGuardGuard], data: { expectedRole: ['admin'] }},
    {path: '**', redirectTo: 'dashboard'}
  ]},

  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
