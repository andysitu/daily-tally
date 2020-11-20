package com.app.dailytally.model;

import java.io.Serializable;

public class CreateTaskBody implements Serializable {
    public String name;
    public int year;
    public int month;
    public String type;

    public CreateTaskBody() {}

    public CreateTaskBody(String name, String type, int month, int year) {
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