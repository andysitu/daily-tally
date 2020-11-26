package com.app.dailytally.model.tasks;

import java.util.Date;
import java.time.*;

public class CountIntTaskMonth extends AbstractTaskMonth {
    public long total = 0;
    public long[] data;

    public CountIntTaskMonth(String taskid, int year, int month) {
        super(taskid, "countint", year, month);

        int days = YearMonth.of(year, month+1).lengthOfMonth();

        this.data = new long[days];
    }

    public long interact(int index, long value) {
        long old_value = data[index];
        data[index] = value;

        total -= old_value;
        total += value;
        return total;
    }
}