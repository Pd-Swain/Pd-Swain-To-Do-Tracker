import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/_services/auth.service';
import { Todo } from 'src/app/_services/todo.model';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { EditTodoDialogComponent } from '../edit-todo-dialog/edit-todo-dialog.component';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss']
})
export class TodayComponent implements OnInit {

  currentUser: any;                             //to store the user info
  panelOpenState = false;                       //for panel expansion
  todos: Todo[] =[];                            //fetching and storing the task of the user
  labels:any=[];                                //fetching and storing the labels of the user
  selected = 'priority4';                       //providing default priority which is priority4
  name = 'name';                                //providing default value for sorting
  ascending = 'asc'                             //providing default value for sorting
  taskSection = false;                          //to show or hide the Task Section
  date_time: Date = new Date();                 //providing current date for default value of date 
  showValidationErrors: boolean = false;        //if any form validation error

  //Only For Testing Purpose
  check(form: NgForm){               
    // alert('Today Compo=>'+this.selectedCateory)
    console.log(form.value.category);
    // const stringfied = JSON.stringify(form.value.start_time);
    // console.log(stringfied);
    // const date = stringfied.substring(1,11);
    // console.log(date);
  }

  dateFormat(dateTime: string){
    const stringfied = new String(dateTime);
    const date = stringfied.substring(0,10);

    //Converting the form date into Date Object
    let dateObj = new Date(date); 
    //To get the next day
    let nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + 1)
    //To get the previous day
    let previousDate = new Date()
    previousDate.setDate(previousDate.getDate() - 1)

    if(dateObj.getDate() == new Date().getDate() && dateObj.getMonth()==new Date().getMonth() && dateObj.getFullYear()==new Date().getFullYear()){
      return 'Today';
    }else if(dateObj.getDate() == nextDate.getDate() && dateObj.getMonth()==nextDate.getMonth() && dateObj.getFullYear()==nextDate.getFullYear()){
      return 'Tomorrow';
    }else if(dateObj.getDate() == previousDate.getDate() && dateObj.getMonth()==previousDate.getMonth() && dateObj.getFullYear()==previousDate.getFullYear()){
      return 'Yesterday';
    }else{
      //We will get the full month
      let longMonth = dateObj.toLocaleString('default', {month: 'long'});
      //Formating the dateObj and returning
      return dateObj.getDate()+" "+longMonth+", "+dateObj.getFullYear();

    }
  }

  //injecting the services, so that we can use its methods, variables
  constructor(private authService: AuthService, private token: TokenStorageService, private dialog: MatDialog) { }

  ngOnInit(): void {
    //by selecting the date in angular date picker, getting the previous date, thats why icreasing the date by one day
    this.date_time = new Date(this.date_time.setDate(this.date_time.getDate() - 1));
    this.currentUser = this.token.getUser();                                                  //saving user info
    //caling the API which is present in AuthService
    this.authService.getUserTaskContent(this.currentUser.email).subscribe({
      next: data => {
        this.todos = JSON.parse(data);                      //fetching the task and storing in todos array
        this.taskSection = true;
        if(data == '' || this.todos.length == 0){
          this.taskSection = false;
        }
      }
    })
    
    this.authService.getUserLabelContent(this.currentUser.email).subscribe({
      next: data => {
        if(data==''){
          console.log("Hello There")
        }else{                                                  //fetching the labels and storing in labels array
          this.labels = JSON.parse(data);
          console.log(this.labels);
        }
      }
    })
  }

  //form submission
  onFormSubmit(form: NgForm){
    //if invalid, it will not submit the form and will show error messages
    if(form.invalid){
      this.showValidationErrors = true;
    }else{
      //generating random task ID
      const taskId = Math.floor(Math.random()*10000000001);
      const stringfied = JSON.stringify(form.value.start_time);
      console.log(stringfied)
      console.log(form)
      //some date issue with angular datepicker, so i need to put it in a proper manner
      if(form.value.start_time === ""){
        form.value.start_time = new Date();
      }else{
        form.value.start_time = new Date(form.value.start_time.setDate(form.value.start_time.getDate() + 1));
      }
      //calling the API and send the form values
      this.authService.addUserContent(taskId, form.value.task, form.value.description, form.value.start_time, form.value.priority, form.value.category, this.currentUser.email).subscribe({
        next: data => {
          console.log(form);
          console.log("After post"+JSON.stringify(data));
          this.reloadPage();                                                  //FOr reloading the page
        }
      })
    }
  }

  //sorting based on name,date,priority
  onSorting(form: NgForm){
    console.log(form);
    // alert("Check Form is Working =>"+form.value.sortcat+" "+form.value.sorttyp);
    
    if(form.value.sortcat=="name"){
      if(form.value.sorttyp=="asc"){
        // cars[0].items.sort((a,b) => a.name.localeCompare(b.name))
        this.todos.sort((a,b) => a.taskName.localeCompare(b.taskName));
        console.log(this.todos)
      }else{
        this.todos.sort((a,b) => b.taskName.localeCompare(a.taskName));
      }
    }else{
      if(form.value.sorttyp=="asc"){
        // cars[0].items.sort((a,b) => a.name.localeCompare(b.name))
        this.todos.sort((a,b) => a.taskPriority.localeCompare(b.taskPriority));
        console.log(this.todos)
      }else{
        this.todos.sort((a,b) => b.taskPriority.localeCompare(a.taskPriority));
      }
    }
  }

  //will reload the current page
  reloadPage(): void {
    window.location.reload();
  }

  //Check the status of task that is completed or not
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
    // const date = todo.taskDueDate.substring(0,10);
    // let dateObj = new Date(date); 
    // dateObj.setDate(dateObj.getDate() - 1)
    // console.log('dae===='+todo.taskDueDate);
    // console.log('dae====>>'+dateObj);
    // const stringfied=JSON.stringify(dateObj);
    // todo.taskDueDate = stringfied.substring(1,stringfied.length-1);
    // console.log('date===='+todo.taskDueDate);
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

  // onSelect(labels: any){
  //   console.log(labels)
  //   this.tags = this.authService.tags().filter((x) => x.id == labels.value);
  //   console.log(this.tags)
  // }

  //if user create new label, adding that label to his account
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

}

