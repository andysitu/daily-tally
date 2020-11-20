package com.app.dailytally;

import com.app.dailytally.model.*;
// import com.app.dailytally.model.requestresponse.*;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Controller;
// import org.springframework.stereotype.Component;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;

// @Component
@Controller
public class TaskController {
    @Autowired
	private CustomerRepository customerrepository;

    @Autowired
    private BasicTaskRepository basicTaskRepository;
    
    @Autowired
    private BasicTaskMonthRepository basicTaskMonthRepository;

    @GetMapping(value={"/view_tasks"})
    public String tasks(@RequestParam(name="name", required=false, defaultValue="User") String name, Model model)
    {
        model.addAttribute("name", name);

        return "view_tasks";
    }

    @RequestMapping(path="/tasks", produces="application/json;", 
                        method = RequestMethod.POST)
    @ResponseBody
    public List<TaskResponse> create_task(@RequestBody CreateTaskBody t) {
        String n = "hello";
        System.out.println(t.name + " " + t.type);

        // basicTaskRepository.deleteAll();

        List<TaskResponse> tasklist = new ArrayList<TaskResponse>();

        BasicTask tsk = new BasicTask(t.name);
        basicTaskRepository.save(tsk);

        BasicTaskMonth btm = new BasicTaskMonth(tsk.id, t.year, t.month);
        basicTaskMonthRepository.save(btm);
        System.out.println("task " + tsk.name + t.year + t.month);

        tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id, btm.data));
        
        return tasklist;
    }

    @RequestMapping(path="/tasks/{taskid}", produces="application/json;", 
                        method = RequestMethod.PATCH)
    @ResponseBody
    public List<TaskResponse> edit_task(
        @PathVariable("taskid") String taskid, @RequestBody TaskRequest t) 
    {
        System.out.println(t.taskid + " " + t.name);
        BasicTask tsk = basicTaskRepository.findById(taskid).orElseThrow(RuntimeException::new);
        tsk.name = t.name;
        basicTaskRepository.save(tsk);

        List<TaskResponse> tasklist = new ArrayList<TaskResponse>();
        tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id));
        
        return tasklist;
    }

    @GetMapping(path="/tasks/delete/{taskid}")
    @ResponseBody
    public Long delete_task(@PathVariable("taskid") String taskid) {
        basicTaskRepository.deleteById(taskid);
        Long num = basicTaskMonthRepository.deleteByTaskid(taskid);
        System.out.println("delete " + num);
        
        return num;
    }

    @GetMapping(value={"/tasks"})
    @ResponseBody
    public List<TaskResponse> get_tasks(@RequestParam int month, @RequestParam int year) {
        List<TaskResponse> tasklist = new ArrayList<TaskResponse>();
        System.out.println("tasks " + month + " " + year);

        for (BasicTask tsk: basicTaskRepository.findAll()) {            
            BasicTaskMonth btm = basicTaskMonthRepository.findByTaskidAndYearAndMonth(tsk.id, year, month);
            if (btm == null) {
                btm = new BasicTaskMonth(tsk.id, year, month);
                basicTaskMonthRepository.save(btm);
            }

            tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id, btm.data));
        }
        
        return tasklist;
    }

    @RequestMapping(path="/tasks/month", produces="application/json;", 
                        method = RequestMethod.PATCH)
    @ResponseBody
    public TaskResponse update_task(@RequestBody UpdateTaskBody tbody) {
        System.out.println(tbody.taskType);

        TaskResponse tr = null;

        if (tbody.taskType.equals("basic")) {
            BasicTask tsk = basicTaskRepository.findById(tbody.taskId).orElseThrow(RuntimeException::new);
            BasicTaskMonth btm = basicTaskMonthRepository.findByTaskidAndYearAndMonth(tbody.taskId, tbody.year, tbody.month);
            if (btm.data[tbody.monthIndex] == 1)
                btm.data[tbody.monthIndex] = 0;
            else
                btm.data[tbody.monthIndex] = 1;
            basicTaskMonthRepository.save(btm);
            tr = new TaskResponse(tsk.name, tsk.type, tsk.id, btm.data);
        }
        return tr;
    }

    @GetMapping("/error")
    public String errorPage() {
        return "error";
    }
}