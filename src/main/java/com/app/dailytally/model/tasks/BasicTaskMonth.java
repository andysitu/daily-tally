package com.app.dailytally.model.tasks;

import java.util.Date;
import java.time.*;

public class BasicTaskMonth extends AbstractTaskMonth {
    public int[] data;

    public BasicTaskMonth(String taskid, int year, int month) {
        super(taskid, "basic", year, month);
        
        int days = YearMonth.of(year, month+1).lengthOfMonth();

        this.data = new int[days];
    }

    public int interact(int index) {
        if (data[index] == 1) {
            data[index] = 0;
        } else {
            data[index] = 1;
        }
        return 0;
    }
}