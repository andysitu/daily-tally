package com.app.dailytally.model;

import org.springframework.data.annotation.Id;

public class Task {
    @Id private String id;

    public String name;

    public Task() {}

    public Task(String name) {
        this.name = name;
    }
}