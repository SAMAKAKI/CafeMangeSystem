import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SnackbarService } from '../../services/snackbar.service';
import { GlobalConstants } from '../../shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();

  productForm: any = FormGroup;
  dialogAction = 'Add';
  action = 'Add';
  responseMessage: any;
  categories: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any, 
    private formBuilder: FormBuilder, 
    private product: ProductService, 
    public dialogRef: MatDialogRef<ProductComponent>, 
    private categoryS: CategoryService, 
    private snack: SnackbarService){}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required],
    })

    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Edit';
      this.productForm.patchValue(this.dialogData.data)
    }

    this.getCategories();
  }

  getCategories(){
    this.categoryS.get().subscribe((response) => {
      this.categories = response;
    }, (error) => {
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  handleSubmit(){
    if(this.dialogAction === 'Edit')
      this.edit();
    else
      this.add();
  }

  add(){
    let formData = this.productForm.value;
    let data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    }

    this.product.add(data).subscribe((response) => {
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = response?.message;
      this.snack.openSnackBar(this.responseMessage, 'success');
    }, (error) => {
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  edit(){
    let formData = this.productForm.value;
    let data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    }

    this.product.update(data).subscribe((response) => {
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response?.message;
      this.snack.openSnackBar(this.responseMessage, 'success');
    }, (error) => {
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
