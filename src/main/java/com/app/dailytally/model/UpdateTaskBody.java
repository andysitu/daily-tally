package com.app.dailytally.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;

public class UpdateTaskBody implements Serializable {
    public String taskId;
    public String type;
    public int monthIndex;
    public int year;
    public int month;
    public int intvalue;
    public double fvalue;
    public long lvalue;

    public UpdateTaskBody() {}

    public UpdateTaskBody(String taskId, String type, 
                int monthIndex, int month, int year, int intvalue) {
        this.taskId = taskId;
        this.type = type;
        this.monthIndex = monthIndex;
        this.month = month;
        this.year = year;
        this.intvalue = intvalue;
    }

    public UpdateTaskBody(String taskId, String type, 
                int monthIndex, int month, int year, double fvalue) {
        this.taskId = taskId;
        this.type = type;
        this.monthIndex = monthIndex;
        this.month = month;
        this.year = year;
        this.fvalue = fvalue;
    }

    public UpdateTaskBody(String taskId, String type, 
                int monthIndex, int month, int year, long lvalue) {
        this.taskId = taskId;
        this.type = type;
        this.monthIndex = monthIndex;
        this.month = month;
        this.year = year;
        this.lvalue = lvalue;
    }
}