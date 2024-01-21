import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { GlobalConstants } from '../../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit{
  forgotPasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private user: UserService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private ngx: NgxUiLoaderService,
    private snack: SnackbarService ){}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
    })
  }

  handleSubmit(){
    this.ngx.start();
    let formData = this.forgotPasswordForm.value;
    let data = {
      email: formData.email
    }
    this.user.forgotPassword(data).subscribe((response) => {
      this.ngx.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snack.openSnackBar(this.responseMessage, "");
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
