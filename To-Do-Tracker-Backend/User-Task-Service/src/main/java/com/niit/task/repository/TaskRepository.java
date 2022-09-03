package com.niit.task.repository;

import com.niit.task.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends MongoRepository<User,String> {
    public User findByEmail(String email);
}
