import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;                                    //to show or hide the password
  isLoggedIn = false;                             //to check wheather user is login already
  isLoginFailed: boolean = false;                 //for login failure
  errorMessage = '';                              //stroing the error message, we get from the backend                            

  //validating all the fields that are present in our form
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('',[Validators.required]);

  //methods are for getting the error messages, if fields are not passing validation arguments
  getErrorMessage() {
    if (this.email.hasError('required') || this.password.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  //injecting the services, so that we can use its methods, variables
  constructor(private router: Router, private authService: AuthService, private tokenStorage: TokenStorageService) { }

  //checking if user is already logged in, we don't let him into this page
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    if (this.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  //when user is submitting the login form, this method will invoked
  onSubmit(): void {
    //checking if the form is invalid it will not call the API
    if(this.email.invalid || this.password.invalid){
      console.log("Invalid")
    }else{
      //checking if the form is valid it will go and call the API
      this.authService.login(this.email.value, this.password.value).subscribe({
        next: data => {
          console.log(data);                                    //get all the user information
          this.tokenStorage.saveUser(data);                     //storing user information in Token Storage Service for future use
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          //calling another API so that, we will get the JWT Token for the user
          this.authService.generateUserToken(this.email.value, this.password.value).subscribe({
            next: data => {
              console.log(data);
              this.tokenStorage.saveToken(data.token);
              this.ngOnInit();
            }
          });
        },
        error: err => {
          this.errorMessage = err.error;                        //if email or password incorrect this error messsage will shown up
          console.log(err.error);
          this.isLoginFailed = true;
        }
      });
    }


  }

}
