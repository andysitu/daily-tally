package com.app.dailytally.model.tasks;

import java.util.Date;
import java.time.*;

public class AmountTaskMonth extends AbstractTaskMonth {
    public double total = 0.0;
    public double[] data;

    public AmountTaskMonth(String taskid, int year, int month) {
        super(taskid, "amount", year, month);

        int days = YearMonth.of(year, month+1).lengthOfMonth();

        this.data = new double[days];
    }

    public double interact(int index, double value) {
        double old_value = data[index];
        data[index] = value;

        total -= old_value;
        total += value;
        return total;
    }
}