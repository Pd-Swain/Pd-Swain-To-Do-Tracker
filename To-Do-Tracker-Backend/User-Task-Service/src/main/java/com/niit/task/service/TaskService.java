package com.niit.task.service;

import com.niit.task.model.Task;
import com.niit.task.model.User;
import com.niit.task.proxy.UserProxy;
import com.niit.task.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private UserProxy userProxy;
    @Autowired
    TaskRepository taskRepository;

    public User registerUser(User user){
        ResponseEntity responseEntity=userProxy.registerUser(user);
        System.out.println(responseEntity);
        return taskRepository.save(user);
    }

    public User saveUserTaskToList(Task task, String email){
        User user=taskRepository.findByEmail(email);
        System.out.println("Saving Tasks To The User TaskList - ");
        System.out.println(user);
        if(user!=null){
            if(user.getTaskList()==null){
                user.setTaskList(Arrays.asList(task));
            }else{
                List favList=user.getTaskList();
                favList.add(task);
                user.setTaskList(favList);
            }
            return taskRepository.save(user);
        }else{
            return null;
        }
    }

    public List<Task> getUserTasks(String email) {
        User user=taskRepository.findByEmail(email);
        System.out.println("Getting The Tasks From The User Task List - ");
        System.out.println(user);
        if(user!=null){
            if(user.getTaskList()==null){
                System.out.println("No Tasks Available");
                return null;
            }else{
                return user.getTaskList();
            }
        }else{
            return null;
        }
    }

    public Task getTaskById(String email, long id){
        User user = taskRepository.findByEmail(email);
        if(user!=null){
            if(user.getTaskList()==null){
                System.out.println("No Tasks Available");
                return null;
            }else{
                for(int i=0;i<user.getTaskList().size();i++){
                    if(user.getTaskList().get(i).getTaskId()==id){
                        return user.getTaskList().get(i);
                    }
                }
            }
        }
        return null;
    }

    public boolean statusOfTask(String email, long id, boolean taskStatus){
        User user = taskRepository.findByEmail(email);
        if(user!=null){
            if(user.getTaskList()==null){
                System.out.println("No Tasks Available");
                return false;
            }else{
                for(int i=0;i<user.getTaskList().size();i++){
                    if(user.getTaskList().get(i).getTaskId()==id){
                        user.getTaskList().get(i).setTaskStatus(taskStatus);
                        taskRepository.save(user);
                        return taskStatus;
                    }
                }
            }
        }
        return false;
    }

    public String deleteTaskById(String email, long id) {
        User user = taskRepository.findByEmail(email);
        if(user!=null){
            if(user.getTaskList()==null){
                System.out.println("No Tasks Available");
                return "No Tasks Available";
            }else{
                for(int i=0;i<user.getTaskList().size();i++){
                    if(user.getTaskList().get(i).getTaskId()==id){
                        System.out.println("Deleting=======>>>>>>"+user.getTaskList().get(i));
                        user.getTaskList().remove(i);
                        taskRepository.save(user);
                        return "Task Deleted";
                    }
                }
            }
        }
        return "No User Is There";
    }

    public List<Task> updateTaskById(String email, long id, Task task) {
        User user = taskRepository.findByEmail(email);
        if(user!=null){
            if(user.getTaskList()==null){
                System.out.println("No Task Available");
                return null;
            }else{
                for(int i=0;i<user.getTaskList().size();i++){
                    if(user.getTaskList().get(i).getTaskId()==id){
                        System.out.println("Before Updating=======>>>>>>"+user.getTaskList().get(i));
                        user.getTaskList().set(i,task);
                        user.getTaskList().get(i).setTaskId(id);
                        taskRepository.save(user);
                        System.out.println("Updating=======>>>>>>"+user.getTaskList().get(i));
                        return user.getTaskList();
                    }
                }
            }
        }
        return null;
    }

    public User saveUserLabelsToList(String label, String email){
        User user=taskRepository.findByEmail(email);
        System.out.println("Saving Labels To The List - ");
        System.out.println(user);
        if(user!=null){
            String newLabel = label.substring(10,label.length()-2);
            System.out.println("New Label - "+newLabel);
            List favList=user.getLabels();
            favList.add(newLabel);
            user.setLabels(favList);
            return taskRepository.save(user);
        }else{
            return null;
        }
    }

    public List<String> getUserLabels(String email) {
        User user=taskRepository.findByEmail(email);
        System.out.println("Getting The Labels From List - ");
        System.out.println(user);
        if(user!=null){
            return user.getLabels();
        }else{
            return null;
        }
    }
}
