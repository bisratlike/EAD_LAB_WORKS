package com.itsc.ioc;

import org.springframework.stereotype.Component;

@Component
public class School {
    private String schoolName;

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }
}
