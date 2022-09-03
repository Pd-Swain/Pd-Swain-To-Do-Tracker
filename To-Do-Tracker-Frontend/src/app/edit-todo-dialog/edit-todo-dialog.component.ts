import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Todo } from '../_services/todo.model';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-edit-todo-dialog',
  templateUrl: './edit-todo-dialog.component.html',
  styleUrls: ['./edit-todo-dialog.component.scss']
})
export class EditTodoDialogComponent implements OnInit {

  currentUser: any;
  selected = 'priority4';
  enteredSearchvalue: string = '';
  todoTextField: string = '';
  dateField: Date = new Date();
  priorityField: string = '';
  categoryField: string = '';
  labels:any=[];
  showValidationErrors: boolean = false;
  showTaskName = true;
  showCalender = false;
  showPriority = false;
  showCategory = false;

  constructor(public dialogRef: MatDialogRef<EditTodoDialogComponent>, @Inject(MAT_DIALOG_DATA) public todo: Todo, private authService: AuthService, private token: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.authService.getUserLabelContent(this.currentUser.email).subscribe({
      next: data => {
        if(data==''){
          console.log("Hello There")
        }else{
          this.labels = JSON.parse(data);
        }
      }
    })
  }

  close() {
    this.dialogRef.close();
  }

  onFormSubmit(form: NgForm){
    if(form.invalid){
      this.showValidationErrors = true;
    }else{
      const taskId = Math.floor(Math.random()*10000000001);
      const stringfied = JSON.stringify(form.value.start_time);
      console.log(stringfied)
      console.log(form)
      if(form.value.start_time === ""){
        form.value.start_time = new Date();
      }else{
        form.value.start_time = new Date(form.value.start_time.setDate(form.value.start_time.getDate() + 1));
      }
      this.authService.addUserContent(taskId, form.value.task, form.value.description, form.value.start_time, form.value.priority, form.value.category, this.currentUser.email).subscribe({
        next: data => {
          console.log(form);
          console.log("After post"+JSON.stringify(data));
          this.reloadPage();
        }
      })
    }
  }

  onEditFormSubmit(form: NgForm) {
    if(form.invalid){
      this.showValidationErrors = true;
    }else{
      form.value.start_time = new Date(form.value.start_time.setDate(form.value.start_time.getDate() + 1));
      this.authService.updateUserTaskContent(form.value.task, form.value.description, form.value.start_time, form.value.priority, form.value.category, this.currentUser.email, this.todo.taskId).subscribe({
        next: data => {
          console.log(data);
          this.reloadPage()
        }
      })
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  search(check: string){
    // alert('date '+ this.dateField)
    if(check=='name'){
      this.enteredSearchvalue=this.todoTextField;
    }else if(check=='date'){
      this.dateField = new Date(this.dateField.setDate(this.dateField.getDate() + 1));
      const stringfied=JSON.stringify(this.dateField)
      this.enteredSearchvalue = stringfied.substring(1,11);
    }else if(check=='priority'){
      this.enteredSearchvalue=this.priorityField;
    }else{
      this.enteredSearchvalue=this.categoryField;
    }
    this.router.navigate(['search-result'],{queryParams: {data: this.enteredSearchvalue}})
    this.close();
  }

  addNewLabel(form: NgForm){
    console.log(form.value.newLabel);
    if(form.value.newLabel == ''){
      console.log(form.value.newLabel);
    }else{
      this.labels.push(form.value.newLabel);
      this.authService.addUserLabel(form.value.newLabel, this.currentUser.email).subscribe({
        next: data => {
          console.log(form);
          console.log(form.value.newLabel);
          console.log(data);
          // this.reloadPage();
        }
      })
    }
  }

  onTaskNameClicked(){
    this.showTaskName = true;
    this.showCalender = false;
    this.showPriority = false;
    this.showCategory = false;
  }

  onDateClicked(){
    this.showTaskName = false;
    this.showCalender = true;
    this.showPriority = false;
    this.showCategory = false;
  }

  onPriorityClicked(){
    this.showTaskName = false;
    this.showCalender = false;
    this.showPriority = true;
    this.showCategory = false;
  }

  onCategoryClicked(){
    this.showTaskName = false;
    this.showCalender = false;
    this.showPriority = false;
    this.showCategory = true;
  }

}
