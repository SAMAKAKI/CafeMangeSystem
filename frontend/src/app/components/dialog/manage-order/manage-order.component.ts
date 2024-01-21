import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { BillService } from '../../../services/bill.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../../../shared/global-constants';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss'
})
export class ManageOrderComponent implements OnInit{
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm:any = FormGroup;
  categories: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  token: any = localStorage.getItem('token');
  tokenPayload: any;

  constructor(private formBuilder: FormBuilder, private category: CategoryService, private product: ProductService, private snack: SnackbarService, private bill: BillService, private ngx: NgxUiLoaderService){
    this.tokenPayload = jwtDecode(this.token);
  }

  ngOnInit(): void {
    this.ngx.start();
    this.getCategories();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    })
  }

  getCategories(){
    this.category.get().subscribe((response) => {
      this.ngx.stop();
      this.categories = response;
    }, (error) => {
      this.ngx.stop();
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  getProductsByCategory(value: any){
    this.product.getProductsByCategory(value.id).subscribe((response) => {
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);
    }, (error) => {
      this.ngx.stop();
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  getProductsDetails(value: any){
    this.product.getProductById(value.id).subscribe((response) => {
      this.price = response.price;
      this.manageOrderForm.controls['price'].setValue(response.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price*1);
    }, (error) => {
      this.ngx.stop();
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  setQuantity(value: any){
    let temp = this.manageOrderForm.controls['quantity'].value;
    if(temp > 0)
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    else if(temp != ''){
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }
  }

  validateProductAdd(){
    if(this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quantity'].value <= 0)
      return true;
    else
      return false;
  }

  validateSubmit(){
    if(this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null || 
    this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['contactNumber'].value === null || 
    this.manageOrderForm.controls['paymentMethod'].value === null || !(this.manageOrderForm.controls['contactNumber'].valid || 
    !(this.manageOrderForm.controls['email'].valid)))
      return true;
    else
      return false;
  }

  add(){
    let formData = this.manageOrderForm.value;
    let productName = this.dataSource.find((e: {id: number;}) => e.id == formData.product.id);
    if(productName === undefined){
      this.totalAmount += formData.total;
      this.dataSource.push({
        id: formData.product.id, 
        name: formData.product.name, 
        category: formData.category.name, 
        quantity: formData.quantity, 
        price: formData.price, 
        total: formData.total});
      this.dataSource = [...this.dataSource];
      this.snack.openSnackBar(GlobalConstants.productAdded, 'success');
    }
    else
      this.snack.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
  }

  handleDeleteAction(value: any, element: any){
    this.totalAmount -= element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction(){
    this.ngx.start();
    let formData = this.manageOrderForm.value;
    let data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    };
    this.bill.generate(data).subscribe((response) => {
      this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;
    }, (error) => {
      this.ngx.stop();
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  downloadFile(fileName: any){
    let data = {
      uuid: fileName
    };

    this.bill.getPdf(data).subscribe((response) => {
      saveAs(response, `${fileName}.pdf`);
      this.ngx.stop();
    })
  }
}
