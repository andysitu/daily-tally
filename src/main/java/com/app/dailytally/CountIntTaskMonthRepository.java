package com.app.dailytally;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Component;

import com.app.dailytally.model.tasks.CountIntTaskMonth;

import java.util.Date;

@Repository
public interface CountIntTaskMonthRepository extends MongoRepository<CountIntTaskMonth, String> {
    public List<CountIntTaskMonth> findByTaskidAndDateBetween(String taskid, Date start_date, Date end_date);
    public CountIntTaskMonth findByTaskidAndYearAndMonth(String taskid, int year, int month);
    public long deleteByTaskid(String taskid);
}