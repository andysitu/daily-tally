package com.app.dailytally.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;

public class TasksRequest implements Serializable {
    public String[][] tasks;
    public int start_year;
    public int start_month;
    public int end_year;
    public int end_month;

    public TasksRequest(String[][] tasks, int start_month, int start_year, 
                        int end_month, int end_year) 
    {
        this.tasks = tasks;
        this.start_month = start_month;
        this.start_year = start_year;
        this.end_month = end_month;
        this.end_year = end_year;
    }
}