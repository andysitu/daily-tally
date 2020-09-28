package com.app.dailytally;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.app.dailytally.model.Task;

import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    public List<Task> findByName(String name);
}