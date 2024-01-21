import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { UserService } from '../../services/user.service';
import { GlobalConstants } from '../../shared/global-constants';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private user: UserService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private ngx: NgxUiLoaderService,
    private snack: SnackbarService,
    private router: Router ){}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]],
    })
  }

  handleSubmit(){
    this.ngx.start();
    let formData = this.loginForm.value;
    let data = {
      email: formData.email,
      password: formData.password
    }
    this.user.login(data).subscribe((response) => {
      this.ngx.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      localStorage.setItem('token', response.token);
      this.router.navigate(['/cafe/dashboard']);
    }, (error) => {
      this.ngx.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
