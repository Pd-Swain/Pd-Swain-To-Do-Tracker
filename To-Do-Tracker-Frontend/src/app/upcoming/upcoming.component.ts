import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditTodoDialogComponent } from '../edit-todo-dialog/edit-todo-dialog.component';
import { AuthService } from '../_services/auth.service';
import { Todo } from '../_services/todo.model';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss']
})
export class UpcomingComponent implements OnInit {

  panelOpenState = false;
  currentUser: any;
  todos: Todo[] = [];
  labels:any = [];
  upcomingTodos: Todo[] = [];
  selected = 'priority4';
  name = 'name';
  ascending = 'asc'
  showValidationErrors: boolean = false;

  constructor(private authService: AuthService, private token: TokenStorageService,  private dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    console.log("Email - "+this.currentUser.email);
    this.authService.getUserTaskContent(this.currentUser.email).subscribe({
      next: data => {
        if(data==''){
          console.log("Hello There")
        }else{
          this.todos = JSON.parse(data);
          console.log(this.todos);
          this.upcomingTasks();
        }
      }
    })

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

  upcomingTasks(){
    for(let i = 0; i<this.todos.length; i++){                   //looping todos array, so we can check how many pending tasks are there
      // console.log(this.todos[i].taskDueDate);
      const stringfied = new String(this.todos[i].taskDueDate);
      const date = stringfied.substring(0,10);
      let dateObj = new Date(date);
      if(dateObj.getDate() > new Date().getDate() && dateObj.getMonth() >= new Date().getMonth() && dateObj.getFullYear() >= new Date().getFullYear()){
        this.upcomingTodos.push(this.todos[i]);
        // console.log(this.upcomingTodos);
      }
    }
  }

  onSorting(form: NgForm){
    console.log(form);
    // alert("Check Form is Working =>"+form.value.sortcat+" "+form.value.sorttyp);
    if(form.value.sortcat=="name"){
      if(form.value.sorttyp=="asc"){
        // cars[0].items.sort((a,b) => a.name.localeCompare(b.name))
        this.upcomingTodos.sort((a,b) => a.taskName.localeCompare(b.taskName));
        console.log(this.todos)
      }else{
        this.upcomingTodos.sort((a,b) => b.taskName.localeCompare(a.taskName));
      }
    }else if(form.value.sortcat=="priority"){
      if(form.value.sorttyp=="asc"){
        this.upcomingTodos.sort((a,b) => a.taskPriority.localeCompare(b.taskPriority));
        console.log(this.todos)
      }else{
        this.upcomingTodos.sort((a,b) => b.taskPriority.localeCompare(a.taskPriority));
      }
    }else{
      // alert(this.todos[0].taskDueDate)
      if(form.value.sorttyp=="asc"){
        this.upcomingTodos.sort((a,b) => a.taskDueDate.localeCompare(b.taskDueDate));
        console.log(this.todos)
      }else{
        this.upcomingTodos.sort((a,b) => b.taskDueDate.localeCompare(a.taskDueDate));
      }
    }
  }

  dateFormat(dateTime: string){
    // console.log(dateTime);
    const stringfied = new String(dateTime);
    // console.log(date);
    const date = stringfied.substring(0,10);
    // console.log(currentDate);

    //Converting the form date into Date Object
    let dateObj = new Date(date);  
    //Increasing dateObj to next day, cause getting the previous day from the angular calender                           
    // dateObj.setDate(dateObj.getDate() + 1);
    //To get the next day
    let nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + 1)
    //To get the previous day
    let previousDate = new Date()
    previousDate.setDate(previousDate.getDate() - 1)

    if(dateObj.getDate() == new Date().getDate() && dateObj.getMonth() == new Date().getMonth() && dateObj.getFullYear() == new Date().getFullYear()){
      return "Today";
    }else if(dateObj.getDate() == nextDate.getDate() && dateObj.getMonth() == nextDate.getMonth() && dateObj.getFullYear() == nextDate.getFullYear()){
      return 'Tomorrow';
    }else if(dateObj.getDate() == previousDate.getDate() && dateObj.getMonth() == previousDate.getMonth() && dateObj.getFullYear() == previousDate.getFullYear()){
      return 'Yesterday';
    }else{
      //We will get the full month
      let longMonth = dateObj.toLocaleString('default', {month: 'long'});
      //Formating the dateObj and returning
      return dateObj.getDate()+" "+longMonth+", "+dateObj.getFullYear();

    }
  }

  onCheckClicked(todo: Todo){
    todo.taskStatus=!todo.taskStatus;
    this.authService.statusOfTask(this.currentUser.email, todo.taskId, todo.taskStatus).subscribe({
      next: data => {
        console.log(todo);
        console.log('Data => '+data);
      }
    })
  }

  //Edit and update the task
  onEditClicked(todo: Todo) {
    let dialogRef = this.dialog.open(EditTodoDialogComponent, {
      width: '700px',
      data: todo
    });
  }

  //Delete the task by its id
  onDeleteClicked(taskId: number){
    this.authService.deleteUserTaskContentById(this.currentUser.email, taskId).subscribe({
        next: data => {
        console.log(data);
        this.reloadPage();
      }
    })
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
          console.log(data);
          // this.reloadPage();
        }
      })
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

}
