package com.app.dailytally;

import com.app.dailytally.model.*;
import com.app.dailytally.model.tasks.*;
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

import java.util.Date;
import java.util.ArrayList;

// @Component
@Controller
public class TaskController {
    @Autowired
	private CustomerRepository customerrepository;

    @Autowired
    private AmountTaskRepository amountTaskRepository;
    @Autowired
    private AmountTaskMonthRepository amountTaskMonthRepository;
    
    @Autowired
    private BasicTaskRepository basicTaskRepository;
    @Autowired
    private BasicTaskMonthRepository basicTaskMonthRepository;

    @Autowired
    private CountIntTaskRepository countIntTaskRepository;
    @Autowired
    private CountIntTaskMonthRepository countIntTaskMonthRepository;

    @GetMapping(value={"/view_tasks"})
    public String tasks(@RequestParam(name="name", required=false, defaultValue="User") String name, Model model)
    {
        model.addAttribute("name", name);

        return "view_tasks";
    }

    @GetMapping(value={"/view_charts"})
    public String tasks()
    {
        return "view_charts";
    }

    @RequestMapping(path="/tasks", produces="application/json;", 
                        method = RequestMethod.POST)
    @ResponseBody
    public List<TaskResponse> create_task(@RequestBody CreateTaskBody t) {
        System.out.println(t.name + " create " + t.type);

        // basicTaskRepository.deleteAll();

        List<TaskResponse> tasklist = new ArrayList<TaskResponse>();

        if (t.type.equals("basic")) {
            BasicTask tsk = new BasicTask(t.name, t.type);
            basicTaskRepository.save(tsk);

            BasicTaskMonth btm = new BasicTaskMonth(tsk.id, t.year, t.month);
            basicTaskMonthRepository.save(btm);

            tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id, btm.data));
        } else if (t.type.equals("amount")) {
            AmountTask atsk = new AmountTask(t.name, t.type);
            amountTaskRepository.save(atsk);

            AmountTaskMonth atm = new AmountTaskMonth(atsk.id, t.year, t.month);
            amountTaskMonthRepository.save(atm);

            tasklist.add(new TaskResponse(atsk.name, atsk.type, atsk.id, atm.data));
        } else if (t.type.equals("countint") || t.type.equals("time")) {
            CountIntTask tsk = new CountIntTask(t.name, t.type);
            countIntTaskRepository.save(tsk);

            CountIntTaskMonth ctm = new CountIntTaskMonth(tsk.id, t.year, t.month);
            countIntTaskMonthRepository.save(ctm);            

            tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id, ctm.data));
        }
        
        return tasklist;
    }

    @RequestMapping(path="/tasks/{taskid}", produces="application/json;", 
                        method = RequestMethod.PATCH)
    @ResponseBody
    public List<TaskResponse> edit_task(
        @PathVariable("taskid") String taskid, @RequestBody TaskRequest t) 
    {
        List<TaskResponse> tasklist = new ArrayList<TaskResponse>();

        if (t.type.equals("basic")) {
            BasicTask tsk = basicTaskRepository.findById(taskid).orElseThrow(RuntimeException::new);
            tsk.name = t.name;
            basicTaskRepository.save(tsk);
            tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id));
        } else if (t.type.equals("amount")) {
            AmountTask tsk = amountTaskRepository.findById(taskid).orElseThrow(RuntimeException::new);
            tsk.name = t.name;
            amountTaskRepository.save(tsk);
            tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id));
        } else if (t.type.equals("countint") || t.type.equals("time")) {
            CountIntTask tsk = countIntTaskRepository.findById((taskid)).orElseThrow(RuntimeException::new);
            tsk.name = t.name;
            countIntTaskRepository.save(tsk);
            tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id));
        }
        
        return tasklist;
    }

    @RequestMapping(path="/tasks/delete/{taskid}", produces="application/json;", 
                        method = RequestMethod.DELETE)
    @ResponseBody
    public long delete_task(
        @PathVariable("taskid") String taskid, @RequestBody TaskRequest t)
    {
        System.out.println("delete " + t.type + " " + taskid);
        if (t.type.equals("basic")) {
            basicTaskRepository.deleteById(taskid);
            long num = basicTaskMonthRepository.deleteByTaskid(taskid);
            
            return num;
        } else if (t.type.equals("amount")) {
            amountTaskRepository.deleteById(taskid);
            long num = amountTaskMonthRepository.deleteByTaskid(taskid);
            
            return num;
        } else if (t.type.equals("countint") || t.type.equals("time")) {
            countIntTaskRepository.deleteById(taskid);
            long num = countIntTaskMonthRepository.deleteByTaskid(taskid);

            return num;
        }
        
        return -1l;
    }

    @GetMapping(value={"/tasks"})
    @ResponseBody
    public List<TaskResponse> get_tasks(
            @RequestParam(required=false) Integer month, 
            @RequestParam(required=false) Integer year) 
    {
        List<TaskResponse> tasklist = new ArrayList<TaskResponse>();
        System.out.println("/GET tasks " + month + " " + year);

        for (BasicTask tsk: basicTaskRepository.findAll()) {
            if (month != null && year != null) {
                BasicTaskMonth btm = basicTaskMonthRepository.findByTaskidAndYearAndMonth(tsk.id, year, month);
                if (btm == null) {
                    btm = new BasicTaskMonth(tsk.id, year, month);
                    basicTaskMonthRepository.save(btm);
                }
                tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id, btm.data));
            } else {
                tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id));
            }
        }

        for (AmountTask tsk: amountTaskRepository.findAll()) {
            if (month != null && year != null) {
                AmountTaskMonth atm = amountTaskMonthRepository.findByTaskidAndYearAndMonth(tsk.id, year, month);
                if (atm == null) {
                    atm = new AmountTaskMonth(tsk.id, year, month);
                    amountTaskMonthRepository.save(atm);
                }
                tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id, atm.data));
            } else {
                tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id));
            }   
        }

        for (CountIntTask tsk: countIntTaskRepository.findAll()) {
            if (month != null && year != null) {
                CountIntTaskMonth ctm = countIntTaskMonthRepository.findByTaskidAndYearAndMonth(tsk.id, year, month);
                if (ctm == null) {
                    ctm = new CountIntTaskMonth(tsk.id, year, month);
                    countIntTaskMonthRepository.save(ctm);
                }
                tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id, ctm.data));
            } else {
                tasklist.add(new TaskResponse(tsk.name, tsk.type, tsk.id));
            }
        }
        
        return tasklist;
    }

    @RequestMapping(path="/tasks/month", produces="application/json;", 
                        method = RequestMethod.PATCH)
    @ResponseBody
    public TaskResponse update_task(@RequestBody UpdateTaskBody tbody) {
        TaskResponse tr = null;

        if (tbody.type.equals("basic")) {
            BasicTask tsk = basicTaskRepository.findById(tbody.taskId).orElseThrow(RuntimeException::new);
            BasicTaskMonth btm = basicTaskMonthRepository.findByTaskidAndYearAndMonth(tbody.taskId, tbody.year, tbody.month);

            btm.interact(tbody.monthIndex);
            
            basicTaskMonthRepository.save(btm);
            tr = new TaskResponse(tsk.name, tsk.type, tsk.id, btm.data);
        } else if (tbody.type.equals("amount")) {
            AmountTask tsk = amountTaskRepository.findById(tbody.taskId).orElseThrow(RuntimeException::new);
            AmountTaskMonth atm = amountTaskMonthRepository.findByTaskidAndYearAndMonth(tbody.taskId, tbody.year, tbody.month);

            atm.interact(tbody.monthIndex, tbody.fvalue);
            
            amountTaskMonthRepository.save(atm);
            tr = new TaskResponse(tsk.name, tsk.type, tsk.id, atm.data);
        } else if (tbody.type.equals("countint") || tbody.type.equals("time")) {
            CountIntTask tsk = countIntTaskRepository.findById(tbody.taskId).orElseThrow(RuntimeException::new);
            CountIntTaskMonth ctm = countIntTaskMonthRepository.findByTaskidAndYearAndMonth(tbody.taskId, tbody.year, tbody.month);

            ctm.interact(tbody.monthIndex, tbody.lvalue);
            countIntTaskMonthRepository.save(ctm);
            tr = new TaskResponse(tsk.name, tsk.type, tsk.id, ctm.data);
        }
        return tr;
    }

    @GetMapping("/error")
    public String errorPage() {
        return "error";
    }

    // Body Data is sent for tasks requested, but no modification actually made
    // tasks: contains arrays of data array
    // dates: contains arrays of [year, month] for each corresponding task
    @RequestMapping(path="/tasks/data", produces="application/json;", 
                        method = RequestMethod.POST)
    @ResponseBody
    public List<TaskData> get_tasks_data(@RequestBody TasksRequest t)
    {
        List<TaskData> tasklist = new ArrayList<TaskData>();

        Date start_date = new Date(t.start_year, t.start_month, 1);
        Date end_date = new Date(t.end_year, t.end_month, 25);
        String type, taskid;
        for (int i=0; i<t.tasks.length; i++) {
            taskid = t.tasks[i][0];
            type = t.tasks[i][1];
            TaskData tr = new TaskData(type, taskid);
            if (type.equals("basic")) {
                BasicTask tsk = basicTaskRepository.findById(taskid).orElseThrow(RuntimeException::new);
                tr.name = tsk.name;

                List<BasicTaskMonth> list_tm = basicTaskMonthRepository.findByTaskidAndDateBetween(taskid, start_date, end_date);
                int[][] data = new int[list_tm.size()][];
                int[][] dates = new int[list_tm.size()][2];
                for (int j = 0; j < list_tm.size(); j++) {
                    data[j] = list_tm.get(j).data;
                    dates[j][0] = list_tm.get(j).date.getYear();
                    dates[j][1] = list_tm.get(j).date.getMonth();
                }
                System.out.println(dates[0][0] + dates[0][1]);
                tr.data = data;
                tr.dates = dates;
            } else if (type.equals("amount")) {
                AmountTask tsk = amountTaskRepository.findById(taskid).orElseThrow(RuntimeException::new);
                tr.name = tsk.name;

                List<AmountTaskMonth> list_tm = amountTaskMonthRepository.findByTaskidAndDateBetween(taskid, start_date, end_date);
                double[][] data = new double[list_tm.size()][];
                int[][] dates = new int[list_tm.size()][2];
                for (int j = 0; j < list_tm.size(); j++) {
                    data[j] = list_tm.get(j).data;
                    dates[j][0] = list_tm.get(j).date.getYear();
                    dates[j][1] = list_tm.get(j).date.getMonth();
                }
                System.out.println(dates[0][0] + dates[0][1]);
                tr.fdata = data;
                tr.dates = dates;
            } else if (type.equals("countint") || type.equals("time")) {
                CountIntTask tsk = countIntTaskRepository.findById(taskid).orElseThrow(RuntimeException::new);
                tr.name = tsk.name;

                List<CountIntTaskMonth> list_tm = countIntTaskMonthRepository.findByTaskidAndDateBetween(taskid, start_date, end_date);
                long[][] data = new long[list_tm.size()][];
                int[][] dates = new int[list_tm.size()][2];
                for (int j = 0; j < list_tm.size(); j++) {
                    data[j] = list_tm.get(j).data;
                    dates[j][0] = list_tm.get(j).date.getYear();
                    dates[j][1] = list_tm.get(j).date.getMonth();
                }
                tr.ldata = data;
                tr.dates = dates;
            }
            tasklist.add(tr);
        }
        
        return tasklist;
    }
}