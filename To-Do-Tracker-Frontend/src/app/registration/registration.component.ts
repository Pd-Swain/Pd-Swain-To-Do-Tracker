import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  hide = true;                      //to show or hide password
  errorMessage = '';                //stroing the error message, we get from the backend
  isSuccessful = false;             //to check if it is a successfull register or not
  isLoggedIn = false;               //to check wheather user is login already
  isSignUpFailed = false;           //for registration failure

  //validating all the fields that are present in our form
  username = new FormControl('',[Validators.required]);
  address = new FormControl('',[Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('',[Validators.required, Validators.minLength(6), Validators.maxLength(20)]);

  //methods are for getting the error messages, if fields are not passing validation arguments
  getUsernameErrorMessage() {
    if (this.username.hasError('pattern')) {
      return 'You can not put numbers or special characters';
    }else if(this.username.hasError('required')){
      return 'This fied can not left blank';
    }
    return '';
  }

  getAddressErrorMessage(){
    if (this.address.hasError('pattern')) {
      return 'You can not put numbers or special characters';
    }else if(this.address.hasError('required')){
      return 'This fied can not left blank';
    }
    return '';
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage(){
    if (this.password.hasError('required')) {
      return 'Password can not be left blank';
    }else if(this.password.hasError('minlength')){
      return 'Password must be 6 letters'
    }else if(this.password.value>=20){
      return 'Password should not be exceed more than 20 characters';
    }else{
      return '';
    }
  }

  //injecting the services, so that we can use its methods, variables
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  //checking if user is already logged in, we don't let him into this page
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    if (this.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  //when user is submitting the registration form, this method will invoked
  onSubmit(): void {
    //checking if the form is invalid it will not call the API
    if(this.username.invalid || this.address.invalid || this.email.invalid || this.password.invalid){
      console.log("Invalid");
    }else{
      //checking if the form is valid it will go and call the API
      this.authService.register(this.username.value,this.email.value,this.password.value,this.address.value).subscribe({
        next: data => {
          console.log(data);
          this.isSuccessful = true;             //if no error occured, 
          this.isSignUpFailed = false;
        },
        error: err => {
          this.errorMessage = err.error;        //if error occured
          console.log("Failed");
          this.isSignUpFailed = true;
        }
      });
    }
  }

}
