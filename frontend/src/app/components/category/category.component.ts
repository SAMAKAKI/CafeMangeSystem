import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import { SnackbarService } from '../../services/snackbar.service';
import { GlobalConstants } from '../../shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit{
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();

  categoryForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any, private formBuilder: FormBuilder, private category: CategoryService, private dialogRef: MatDialogRef<CategoryComponent>, private snack: SnackbarService){}

  ngOnInit(): void {
      this.categoryForm = this.formBuilder.group({
        name: [null, [Validators.required]],
      });
      if(this.dialogData.action === 'Edit'){
        this.dialogAction = 'Edit';
        this.action = 'Update';
        this.categoryForm.patchValue(this.dialogData.data)
      }
  }

  handleSubmit(){
    if(this.dialogAction === 'Edit')
      this.edit()
    else
    this.add();
  }

  add(){
    let formData = this.categoryForm.value;
    let data = {
      name: formData.name,
    }
    this.category.add(data).subscribe((response) => {
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = response.message;
      this.snack.openSnackBar(this.responseMessage, 'success');
    }, (error) => {
      this.dialogRef.close();
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  edit(){
    let formData = this.categoryForm.value;
    let data = {
      id: this.dialogData.data.id,
      name: formData.name,
    }
    this.category.update(data).subscribe((response) => {
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = response.message;
      this.snack.openSnackBar(this.responseMessage, 'success');
    }, (error) => {
      this.dialogRef.close();
      if(error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.genericError;
      this.snack.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
