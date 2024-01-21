import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from '../../../shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{
  changePasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private snack: SnackbarService, 
    private ngx: NgxUiLoaderService, 
    private user: UserService, 
    private dialogRef: MatDialogRef<ChangePasswordComponent>){}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value !== this.changePasswordForm.controls['confirmPassword'].value)
      return true;
    else
      return false;
  }

  handleChangePasswordSubmit(){
    this.ngx.start();
    let formData = this.changePasswordForm.value;
    let data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    }
    this.user.changePassword(data).subscribe((response: any) => {
      this.ngx.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snack.openSnackBar(this.responseMessage, 'success');
    }, (error) => {
      console.log(error);
      this.ngx.stop();
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
