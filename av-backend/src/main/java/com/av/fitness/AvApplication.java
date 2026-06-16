package com.av.fitness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan("com.av.fitness")
@EnableJpaRepositories("com.av.fitness.repository")
@EntityScan("com.av.fitness.model")
@EnableScheduling
public class AvApplication {

    public static void main(String[] args) {
        SpringApplication.run(AvApplication.class, args);
    }
}
