import { Injectable } from "@angular/core";

export interface Menu {
  state: string;
  name: string;
  icon: string;
  role: string;
}

const MENUITEMS = [
  {state: 'dashboard', name: 'Dashboard', icon: 'dashboard', role: ''},
  {state: 'manage-category', name: 'Manage Categories', icon: 'category', role: 'admin'},
  {state: 'manage-product', name: 'Manage Products', icon: 'conveyor_belt', role: 'admin'},
  {state: 'manage-order', name: 'Manage Orders', icon: 'list_alt', role: ''},
  {state: 'bill', name: 'View Bills', icon: 'import_contacts', role: ''},
  {state: 'manage-user', name: 'Manage Users', icon: 'group', role: 'admin'},
];

@Injectable({
  providedIn: 'root'
})
export class MenuItems{
  getMenuItem(): Menu[]{
    return MENUITEMS;
  }
}
