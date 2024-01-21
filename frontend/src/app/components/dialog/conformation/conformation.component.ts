import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-conformation',
  templateUrl: './conformation.component.html',
  styleUrl: './conformation.component.scss'
})
export class ConformationComponent implements OnInit{
  onEmiStatusChange = new EventEmitter();
  details: any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any){}

  ngOnInit(): void {
      if(this.dialogData){
        this.details = this.dialogData;
      }
  }

  handleChangeAction(){
    this.onEmiStatusChange.emit();
  }
}
