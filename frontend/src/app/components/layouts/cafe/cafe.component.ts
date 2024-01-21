import { Component } from '@angular/core';
import { faShop as faShopSolid, faBars as faBarsSolid} from '@fortawesome/free-solid-svg-icons';
import { MenuItems } from '../../../shared/menu-items';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-cafe',
  templateUrl: './cafe.component.html',
  styleUrl: './cafe.component.scss'
})
export class CafeComponent {
  faShop = faShopSolid;
  faBars = faBarsSolid;

  token: any = localStorage.getItem('token');
  tokenPayload: any;

  constructor(public menuItems: MenuItems){
    this.tokenPayload = jwtDecode(this.token);
  }
}
