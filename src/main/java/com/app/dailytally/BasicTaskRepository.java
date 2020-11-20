package com.app.dailytally;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Component;

import com.app.dailytally.model.BasicTask;

@Repository
public interface BasicTaskRepository extends MongoRepository<BasicTask, String> {
    public List<BasicTask> findByName(String name);
}