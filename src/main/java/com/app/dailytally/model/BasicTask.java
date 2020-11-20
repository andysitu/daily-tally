package com.app.dailytally.model;

import org.springframework.data.annotation.Id;

public class BasicTask {
    @Id public String id;

    public String name;
    public String type = "basic";

    public BasicTask() {}

    public BasicTask(String name) {
        this.name = name;
    }
}