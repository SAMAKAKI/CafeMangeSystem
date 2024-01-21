import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrl: './view-bill.component.scss'
})
export class ViewBillComponent implements OnInit{
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total'];
  dataSource: any;
  data: any;

  constructor(@Inject(MAT_DIALOG_DATA) private dialogData: any, private dialogRef: MatDialogRef<ViewBillComponent>){}

  ngOnInit(): void {
    this.data = this.dialogData.data;
    this.dataSource = this.dialogData.data.productDetails;
  }

}
