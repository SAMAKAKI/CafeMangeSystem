import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { faCircleUser as faCircleUserSolid} from '@fortawesome/free-solid-svg-icons';
import { ConformationComponent } from '../../dialog/conformation/conformation.component';
import { ChangePasswordComponent } from '../../dialog/change-password/change-password.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  faCircleUser = faCircleUserSolid;

  constructor(private router: Router, private dialog: MatDialog){}

  logout(){
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      message: 'Logout'
    };
    const dialogRef = this.dialog.open(ConformationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmiStatusChange.subscribe((user) => {
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);
    })
  }

  changePassword(){
    const dialogConfig = new MatDialogConfig;
    dialogConfig.width = "550px";
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }
}
