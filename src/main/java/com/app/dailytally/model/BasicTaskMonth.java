package com.app.dailytally.model;

import org.springframework.data.annotation.Id;
import java.time.*;

public class BasicTaskMonth {
    @Id public String id;
    public String taskid;

    public int[] data;
    public int year;
    public int month;
    public int days;

    public BasicTaskMonth(String taskid, int year, int month) {
        this.taskid = taskid;
        this.year = year;
        this.month = month;
        
        // YearMonth uses 1-12 while month will be 0-11 from JS
        this.days = YearMonth.of(year, month+1).lengthOfMonth();

        this.data = new int[this.days];
    }
}