import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { GlobalConstants } from '../../shared/global-constants';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  token: any = localStorage.getItem('token');
  tokenPayload: any;
  
  responseMessage: any;
  data: any;

  constructor(private dashboard: DashboardService, private ngx: NgxUiLoaderService, private snack: SnackbarService){
    this.tokenPayload = jwtDecode(this.token);
    this.ngx.start();
  }

  dashboardData(){
    this.dashboard.getDetails().subscribe((response) => {
      this.ngx.stop();
      this.data = response;
    }, (error) => {
      this.ngx.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      } else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  ngOnInit(): void {
      this.dashboardData();
  }
} 
