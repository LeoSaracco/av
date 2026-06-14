package com.av.fitness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.av.fitness.repository")
@EntityScan("com.av.fitness.model")
public class AvFitnessApplication {

    public static void main(String[] args) {
        SpringApplication.run(AvFitnessApplication.class, args);
    }
}
