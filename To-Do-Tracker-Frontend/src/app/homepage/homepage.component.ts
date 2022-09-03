import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditTodoDialogComponent } from '../edit-todo-dialog/edit-todo-dialog.component';
import { Todo } from '../_services/todo.model';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

  panelOpenState = false;                               //to open or close the mat pannel
  enteredSearchvalue: string = '';                      //the value user wants to search, we are stroing here
  isLoggedIn = false;                                   //to check wheather user is login or not
  user: any;                                            //storing user information
  notification: number = 0;                             //number of pending tasks will store here
  todos: Todo[] = [];                                   //fetching and storing the tasks that user created
  todo: Todo = new Todo();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    //injecting the services, so that we can use its methods, variables
  constructor(private authService: AuthService, private breakpointObserver: BreakpointObserver, private tokenStorageService: TokenStorageService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();    //if user is logged in, it will became true otherwise it will remain false
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();           //storing user information in user variable   

      this.authService.getUserTaskContent(this.user.email).subscribe({
        next: data => {
          if(data==''){
            
          }else{
            this.todos = JSON.parse(data);                       //fetching and storing the tasks that user created
            this.overdueTasks()                                  //calling this method to get the number of pending tasks
          }
        }
      })
    }
  }

  overdueTasks(){
    for(let i = 0; i<this.todos.length; i++){                   //looping todos array, so we can check how many pending tasks are there
      // console.log(this.todos[i].taskDueDate);
      const stringfied = new String(this.todos[i].taskDueDate);
      const date = stringfied.substring(0,10);
      let dateObj = new Date(date);
      if(!this.todos[i].taskStatus){
        if(dateObj.getDate() >= new Date().getDate() && dateObj.getMonth() >= new Date().getMonth() && dateObj.getFullYear() >= new Date().getFullYear()){
      
        }else{
          this.notification = this.notification+1;
          console.log(this.notification);
        }
      }
    }
  }

  logout(): void {                                              //clicking on logout, the page will log you out and take you login page
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  //when user will search something, it will take them to search-result page along with search data
  search(){                      
    this.router.navigate(['search-result'],{queryParams: {data: this.enteredSearchvalue}})
  }

  //when user clear the searchbar
  reset(){
    this.enteredSearchvalue='';
  }

  //when user clicked on filter, it will pop up a window with the help of EditTodoDialogComponent and according to filterization,
  //it will show the filter results
  onFilterClicked(){
    this.todo.taskId = -1;
    let dialogRef = this.dialog.open(EditTodoDialogComponent, {
      width: '700px',
      data: this.todo
    });
  }

  //when user will click on add icon, it will pop up a window with the help of EditTodoDialogComponent 
  onAddClicked(){
    this.todo.taskId = 0;
    let dialogRef = this.dialog.open(EditTodoDialogComponent, {
      width: '700px',
      data: this.todo
    });
  }

}
