package com.app.dailytally.model;

// import java.io.Serializable;

public class TaskResponse {
    public String name;
    public String type;
    public String id;
    public int data[];

    public TaskResponse(String name, String type, String id, int[] data) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.data = data;
    }

    public TaskResponse(String name, String type, String id) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.data = data;
    }
}