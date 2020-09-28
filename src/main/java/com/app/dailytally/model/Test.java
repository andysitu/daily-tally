package com.app.dailytally.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;

public class Test implements Serializable {
    public String name;

    private static final long serialVersionUID = -1764970284520387975L;

    public Test() {}

    public Test(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}