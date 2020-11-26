package com.app.dailytally.model;

import java.util.Date;

// import java.io.Serializable;

public class TaskData {
    public String name;
    public String type;
    public String id;
    public int[][] dates;

    public int[][] data;
    public long[][] ldata;
    public double[][] fdata;

    public TaskData(String name, String type, String id, int[][] data) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.data = data;
    }

    public TaskData(String name, String type, String id, double[][] data) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.fdata = data;
    }

    public TaskData(String name, String type, String id, long[][] ldata) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.ldata = ldata;
    }

    public TaskData(String name, String type, String id) {
        this.name = name;
        this.type = type;
        this.id = id;
    }

    public TaskData(String type, String id) {
        this.type = type;
        this.id = id;
    }
}