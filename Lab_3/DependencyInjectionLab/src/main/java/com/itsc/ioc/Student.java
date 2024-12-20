package com.itsc.ioc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Student {
    private String name;
    private School school;

    @Autowired
    public void setSchool(School school) {
        this.school = school;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void getDetails() {
        System.out.println(name + " is learning at: " + school.getSchoolName());
    }
}
