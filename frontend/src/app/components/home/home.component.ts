import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { faShop as faShopSolid } from '@fortawesome/free-solid-svg-icons';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  faShop = faShopSolid;

  constructor(private dialog: MatDialog, private router: Router, private user: UserService){}

  signupAction(){
    const dialogConfig = new MatDialogConfig;
    dialogConfig.width = '550px';
    this.dialog.open(SignupComponent, dialogConfig);
  }

  forgotPasswordAction(){
    const dialogConfig = new MatDialogConfig;
    dialogConfig.width = '550px';
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }

  loginAction(){
    const dialogConfig = new MatDialogConfig;
    dialogConfig.width = '550px';
    this.dialog.open(LoginComponent, dialogConfig);
  }

  ngOnInit(): void {
    if(localStorage.getItem('token') != null){
      this.user.checkToken().subscribe((response) =>{
        this.router.navigate(['/cafe/dashboard']);
      }, (error) => {
        console.log(error);
      });
    }
  }
}
