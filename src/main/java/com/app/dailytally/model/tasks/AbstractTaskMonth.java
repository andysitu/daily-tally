package com.app.dailytally.model.tasks;

import org.springframework.data.annotation.Id;

import java.io.Serializable;

import java.util.Date;

import java.time.*;

public abstract class AbstractTaskMonth implements Serializable {
    @Id public String id;
    public String taskid;
    public String tasktype;

    public int year;
    public int month;
    public int days;
    public Date date;

    public AbstractTaskMonth(String taskid, String tasktype, int year, int month) {
        this.taskid = taskid;
        this.year = year;
        this.month = month;
        this.days = days;

        // 10th so that search for dates will be easier (user beginning and end of month)
        this.date = new Date(year, month, 10);
        
        // YearMonth uses 1-12 while month will be 0-11 from JS
        this.days = YearMonth.of(year, month+1).lengthOfMonth();
    }
}