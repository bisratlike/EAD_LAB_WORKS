package com.github.bisrat;

//  Bisrat like Melak
// ugr_6177_13

    public class Main {
public static void main(String[] args) {
BookStore todo = new BookStore();
todo.setTitle("Buy groceries");
todo.setAuthor("Pending");
todo.setPrice(100);
System.out.println("Title: " + todo.getTitle());
System.out.println("Author: " + todo.getAuthor());
System.out.println("Price: " + todo.getPrice());
}
}

