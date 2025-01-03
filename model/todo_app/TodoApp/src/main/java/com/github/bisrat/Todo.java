package com.github.bisrat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TodoItem {
    private int id;
    private String description;
    private String status;
    private String dueDate;
}
