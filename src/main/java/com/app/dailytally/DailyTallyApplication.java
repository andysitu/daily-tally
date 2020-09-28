package com.app.dailytally;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
public class DailyTallyApplication {

	// @Autowired
	// private TaskRepository taskRepository;

	public static void main(String[] args) {
		SpringApplication.run(DailyTallyApplication.class, args);
	}

}