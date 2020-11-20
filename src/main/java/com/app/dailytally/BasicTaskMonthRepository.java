package com.app.dailytally;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Component;

import com.app.dailytally.model.BasicTaskMonth;

@Repository
public interface BasicTaskMonthRepository extends MongoRepository<BasicTaskMonth, String> {
    public BasicTaskMonth findByTaskidAndYearAndMonth(String taskid, int year, int month);
    public Long deleteByTaskid(String taskid);
}