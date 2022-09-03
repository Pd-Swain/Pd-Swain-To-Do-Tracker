package com.niit.task.controller;

import com.niit.task.model.Task;
import com.niit.task.model.User;
import com.niit.task.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2")
public class TaskController {

    ResponseEntity responseEntity;

    @Autowired
    TaskService taskService;

    @GetMapping("/all")
    public String home(){
        return "Welcome To Movie Service, Please Login To See Your Movie List";
    }

    @GetMapping("/admin")
    public String admin(){
        return "Welcome Admin";
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody User user){
        System.out.println(user);
        try{
            responseEntity=new ResponseEntity<>(taskService.registerUser(user), HttpStatus.CREATED);
        }catch (Exception e){
            responseEntity=new ResponseEntity<>("Not registered",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @PostMapping("/user/{email}/task")
    public ResponseEntity<?> saveFavTask(@RequestBody Task task, @PathVariable String email){
        System.out.println(task+" "+email);
        return responseEntity=new ResponseEntity<>(taskService.saveUserTaskToList(task,email),HttpStatus.OK);
    }

    @GetMapping("/user/{email}/task")
    public ResponseEntity<?> getUserTask(@PathVariable("email") String email){
        return new ResponseEntity<>(taskService.getUserTasks(email), HttpStatus.OK);
    }

    @GetMapping("user/{email}/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable("email") String email,@PathVariable("id") long id){
        return new ResponseEntity<>(taskService.getTaskById(email,id), HttpStatus.OK);
    }

    @DeleteMapping("/user/{email}/{id}")
    public ResponseEntity<?> deleteTaskById(@PathVariable("email") String email, @PathVariable("id") long id){
        return new ResponseEntity<>(taskService.deleteTaskById(email,id),HttpStatus.OK);
    }

    @PutMapping("/user/{email}/{id}")
    public ResponseEntity<?> updateTaskById(@RequestBody Task task, @PathVariable("email") String email, @PathVariable("id") long id){
        return new ResponseEntity<>(taskService.updateTaskById(email,id,task),HttpStatus.OK);
    }

    @PostMapping("/user/{email}/{id}/{taskStatus}")
    public ResponseEntity<?> setStatusOfTask(@PathVariable("email") String email, @PathVariable("id") long id, @PathVariable("taskStatus") boolean taskStatus){
        return new ResponseEntity<>(taskService.statusOfTask(email, id, taskStatus),HttpStatus.OK);
    }

    @PostMapping("/user/{email}/label")
    public ResponseEntity<?> saveFavLabel(@RequestBody String label, @PathVariable String email){
        System.out.println(label+" "+email);
        return responseEntity=new ResponseEntity<>(taskService.saveUserLabelsToList(label,email),HttpStatus.OK);
    }

    @GetMapping("/user/{email}/label")
    public ResponseEntity<?> getUserLabel(@PathVariable("email") String email){
        return new ResponseEntity<>(taskService.getUserLabels(email), HttpStatus.OK);
    }


}
