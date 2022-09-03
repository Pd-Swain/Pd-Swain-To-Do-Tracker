package com.niit.user.service;

import com.niit.user.model.User;
import com.niit.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public User addUser(User user){
        return userRepository.save(user);
    }

    public List<User> getAllUser(){
        return userRepository.findAll();
    }

    public String deleteUser(String email) {
        userRepository.deleteById(email);
        return "User Deleted";
    }

    public User findByEmailAndPasswordCheck(String email,String password){
        System.out.println("Email =>> "+email+" Password =>> "+password);
        User user=userRepository.findByEmailAndPassword(email,password);
        if(user==null){
            System.out.println("This user is not registered");
        }
        return user;
    }

}
