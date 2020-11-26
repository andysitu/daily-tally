package com.app.dailytally;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Component;

import com.app.dailytally.model.tasks.AmountTask;

@Repository
public interface AmountTaskRepository extends MongoRepository<AmountTask, String> {
    public List<AmountTask> findByName(String name);
}