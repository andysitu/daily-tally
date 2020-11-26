package com.app.dailytally.model.tasks;

import java.io.Serializable;

import org.springframework.data.annotation.Id;

public abstract class AbstractTask implements Serializable {
    @Id
    public String id;

    public String name;
    public String type;
    public String tasktype;

    public AbstractTask(String name, String type, String tasktype) {
        this.name = name;
        this.type = type;
        this.tasktype = tasktype;
    }
}