package com.app.dailytally.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;

public class UpdateTaskBody implements Serializable {
    public String taskId;
    public String taskType;
    public int monthIndex;
    public int year;
    public int month;

    public UpdateTaskBody() {}

    public UpdateTaskBody(String taskId, String taskType, 
                int monthIndex, int month, int year) {
        this.taskId = taskId;
        this.taskType = taskType;
        this.monthIndex = monthIndex;
        this.month = month;
        this.year = year;
    }
}