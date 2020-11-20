package com.app.dailytally.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;

public class TaskRequest implements Serializable {
    public String name;
    public String taskid;
    public String type;
    public int year;
    public int month;

    public TaskRequest() {}

    public TaskRequest(String taskid, String name, String type, int month, int year) {
        this.taskid = taskid;
        this.name = name;
        this.month = month;
        this.year = year;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}