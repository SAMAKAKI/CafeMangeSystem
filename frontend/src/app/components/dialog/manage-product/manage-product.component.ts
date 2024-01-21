import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../services/snackbar.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { GlobalConstants } from '../../../shared/global-constants';
import { MatTableDataSource } from '@angular/material/table';
import { ProductComponent } from '../../product/product.component';
import { ConformationComponent } from '../conformation/conformation.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit{
  displayedColumns: string[] = ['name', 'categoryName', 'description', 'price', 'edit'];
  dataSource: any;
  responseMessage: any;

  token: any = localStorage.getItem('token');
  tokenPayload: any;

  constructor(private product: ProductService, private dialog: MatDialog, private ngx: NgxUiLoaderService, private snack: SnackbarService, private router: Router){
    this.tokenPayload = jwtDecode(this.token);
    if(this.tokenPayload.role == 'user'){
      this.router.navigate(['/cafe/dashboard']);
      snack.openSnackBar(GlobalConstants.genericError, GlobalConstants.error);
    }
  }

  ngOnInit(): void {
    this.ngx.start();
    this.tableData();
  }

  tableData(){
    this.product.get().subscribe((response) => {
      this.ngx.stop();
      this.dataSource = new MatTableDataSource(response);
    }, (error) =>{
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

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close()
    })

    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response) => {
      this.tableData()
    })
  }

  handleEditAction(value: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: value
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close()
    })

    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response) => {
      this.tableData()
    })
  }

  handleDeleteAction(value: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Delete ${value.name} product`
    };
    const dialogRef = this.dialog.open(ConformationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmiStatusChange.subscribe((response) => {
      this.ngx.start();
      this.deleteProduct(value.id);
      dialogRef.close();
    })
  }

  deleteProduct(id: any){
    this.product.delete(id).subscribe((response) => {
      this.ngx.stop();
      this.tableData();
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

  onChange(status: any, id: any){
    let data = {
      status: status.toString(),
      id: id
    }
    this.product.updateStatus(data).subscribe((response) => {
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
