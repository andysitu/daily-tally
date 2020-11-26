package com.app.dailytally;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Component;

import com.app.dailytally.model.tasks.AmountTaskMonth;

import java.util.Date;

@Repository
public interface AmountTaskMonthRepository extends MongoRepository<AmountTaskMonth, String> {
    public List<AmountTaskMonth> findByTaskidAndDateBetween(String taskid, Date start_date, Date end_date);
    public AmountTaskMonth findByTaskidAndYearAndMonth(String taskid, int year, int month);
    public long deleteByTaskid(String taskid);
}