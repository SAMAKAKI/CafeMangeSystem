import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../services/snackbar.service';
import { MenuItems } from '../../../shared/menu-items';
import { jwtDecode } from 'jwt-decode';
import { faShop as faShopSolid, faBars as faBarsSolid} from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../../shared/global-constants';
import { CategoryComponent } from '../../category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.scss'
})
export class ManageCategoryComponent implements OnInit{
  faShop = faShopSolid;
  faBars = faBarsSolid;
  displayedColumns: string[] = ['name', 'edit'];
  dataSource: any;
  responseMessage: any;

  token: any = localStorage.getItem('token');
  tokenPayload: any;

  constructor(private category: CategoryService, private dialog: MatDialog, private ngx: NgxUiLoaderService, private snack: SnackbarService, private router: Router){
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
    this.category.get().subscribe((response) => {
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
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close()
    })

    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response) => {
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
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close()
    })

    const sub = dialogRef.componentInstance.onEditCategory.subscribe((response) => {
      this.tableData()
    })
  }
}
