package com.niit.user.controller;

import com.niit.user.model.User;
import com.niit.user.service.JWTSecurityToken;
import com.niit.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    JWTSecurityToken jwtSecurityToken;

    @GetMapping("/all")
    public String home(){
        return "Welcome To Movie Service, Please Login To See Your Movie List";
    }

    @GetMapping("/admin")
    public String admin(){
        return "Welcome Admin";
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user){
        return new ResponseEntity<>(userService.addUser(user), HttpStatus.CREATED);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(){
        List<User> users=userService.getAllUser();
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @DeleteMapping("/user/{email}/delete")
    public ResponseEntity<String> deleteUser(@PathVariable("email") String email){
        return new ResponseEntity<String>(userService.deleteUser(email),HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> checkCredentials(@RequestBody User user){
        ResponseEntity responseEntity;
        try{
            User user1=userService.findByEmailAndPasswordCheck(user.getEmail(),user.getPassword());
            Map<String,String> tokenMap=jwtSecurityToken.generateToken(user1);
            responseEntity=new ResponseEntity<>(user1,HttpStatus.OK);
        }catch (Exception e){
            responseEntity=new ResponseEntity<>("Credentials Incorrect", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @PostMapping("/login/user/token")
    public ResponseEntity<?> checkTokenMap(@RequestBody User user){
        ResponseEntity responseEntity;
        try{
            User user1=userService.findByEmailAndPasswordCheck(user.getEmail(),user.getPassword());
            Map<String,String> tokenMap=jwtSecurityToken.generateToken(user1);
            responseEntity=new ResponseEntity<>(tokenMap,HttpStatus.OK);
        }catch (Exception e){
            responseEntity=new ResponseEntity<>("Credentials Incorrect", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

}
