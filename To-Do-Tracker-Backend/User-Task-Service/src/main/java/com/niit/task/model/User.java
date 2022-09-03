package com.niit.task.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;
import java.util.List;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User {
    @Id
    private String email;
    private String username;
    @Transient
    private String password;
    private String address;
    private List<Task> taskList;
    private List<String> labels = Arrays.asList("read");
}
