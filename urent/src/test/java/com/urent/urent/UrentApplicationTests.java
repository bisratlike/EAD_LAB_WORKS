package com.urent.urent;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration"
})
public class UrentApplicationTests {

@Test
void contextLoads() {
    // Test full application context load
    System.out.println("Application context loaded successfully!");
}
}