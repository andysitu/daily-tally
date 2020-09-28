package com.app.dailytally;

import com.app.dailytally.model.*;
import com.app.dailytally.TaskRepository;

import java.util.List;

import org.springframework.stereotype.Controller;
// import org.springframework.stereotype.Component;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestBody;

// @Component
@Controller
public class TasksController {
    // private TaskRepository taskRepository;

    // public TasksController(TaskRepository taskRepository) {
    //     this.taskRepository = taskRepository;
    // }

    @GetMapping(value={"/tasks", "/test"})
    public String tasks(@RequestParam(name="name", required=false, defaultValue="User") String name, Model model) {
        model.addAttribute("name", name);
        return "greeting";
    }

    // @RequestMapping(path="/create_task", produces="application/json;", method = RequestMethod.POST)
    // @ResponseBody
    // public String create_task(@RequestBody Test t) {
    //     this.taskRepository.save(new Task(t.name));
    //     List<Task> tasks = this.taskRepository.findByName(t.name);
    //     for (Task task : tasks) {
    //         System.out.println(task.name);
    //     }
    //     return "52452";
    // }

    @GetMapping("/error")
    public String errorPage() {
        return "error";
    }
}