package com.app.dailytally;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Component;

import com.app.dailytally.model.tasks.CountIntTask;

@Repository
public interface CountIntTaskRepository extends MongoRepository<CountIntTask, String> {
    public List<CountIntTask> findByName(String name);
}