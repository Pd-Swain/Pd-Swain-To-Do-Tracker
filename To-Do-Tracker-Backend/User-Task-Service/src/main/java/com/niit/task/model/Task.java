package com.niit.task.model;

import lombok.*;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Task {
    @Id
    private long taskId;
    private String taskName;
    private String taskDescription;
    private String taskDueDate;
    private String taskPriority;
    private String taskCategory;
    private boolean taskStatus;
}
