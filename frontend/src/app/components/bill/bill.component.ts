import { ConformationComponent } from './../dialog/conformation/conformation.component';
import { Component, OnInit } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-constants';
import { ViewBillComponent } from '../dialog/view-bill/view-bill.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.scss'
})
export class BillComponent implements OnInit{
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource: any;
  responseMessage: any;

  constructor(private bill: BillService, private ngx: NgxUiLoaderService, private dialog: MatDialog, private snack: SnackbarService, private router: Router){}

  ngOnInit(): void {
    this.ngx.start();
    this.tableData();
  }

  tableData(){
    this.bill.getBills().subscribe((response) => {
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

  handleViewAction(values: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values
    };
    dialogConfig.width = '100%';
    const dialogRef = this.dialog.open(ViewBillComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    }, (error) => {
      this.ngx.stop();
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  handleDownloadReportAction(values: any){
    this.ngx.start();
    let data = {
      name: values.name,
      email: values.email,
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      totalAmount: values.totalAmount,
      productDetails: values.productDetails
    };
    this.bill.getPdf(data).subscribe((response) => {
      saveAs(response, `${values.uuid}.pdf`);
      this.ngx.stop();
    }) 
  }

  handleDeleteAction(values: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `delete ${values.name} bill`
    };
    const dialogRef = this.dialog.open(ConformationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmiStatusChange.subscribe((response) => {
      this.ngx.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id: any){
    this.bill.delete(id).subscribe((response) => {
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

}
