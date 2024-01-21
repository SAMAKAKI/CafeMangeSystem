import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../../shared/global-constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{
  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private user: UserService, 
    private snack: SnackbarService, 
    private dialogRef: MatDialogRef<SignupComponent>, 
    private ngx: NgxUiLoaderService
    ){}

    ngOnInit(): void {
        this.signupForm = this.formBuilder.group({
          name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
          email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
          contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
          password: [null, [Validators.required]],
        })
    }

    handleSubmit(){
      this.ngx.start();
      let formData = this.signupForm.value;
      let data = {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        password: formData.password,
      }
      this.user.signUp(data).subscribe((response: any) => {
        this.ngx.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snack.openSnackBar(this.responseMessage, ""),
        this.router.navigate(['/']);
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
