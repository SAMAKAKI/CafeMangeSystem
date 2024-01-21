import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../../services/user.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { GlobalConstants } from '../../../shared/global-constants';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss'
})
export class ManageUserComponent implements OnInit{
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource: any;
  responseMessage: any;

  constructor(private ngx: NgxUiLoaderService, private user: UserService, private snack: SnackbarService){}

  ngOnInit(): void {
    this.ngx.start();
    this.tableData();
  }

  tableData(){
    this.user.getUsers().subscribe((response) => {
      this.ngx.stop();
      this.dataSource = new MatTableDataSource(response);
    }, (error) => {
      this.ngx.stop();
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleChangeAction(status: any, id: any){
    this.ngx.start();
    let data = {
      status: status.toString(),
      id: id
    }
    this.user.updateUser(data).subscribe((response) => {
      this.ngx.stop();
      this.responseMessage = response?.message;
      this.snack.openSnackBar(this.responseMessage, 'success');
    }, (error) => {
      this.ngx.stop();
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
