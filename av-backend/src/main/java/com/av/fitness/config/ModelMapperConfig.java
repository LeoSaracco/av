package com.av.fitness.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configures ModelMapper bean for entity-to-DTO mapping.
 */
@Configuration
public class ModelMapperConfig {

    /**
     * @return a default {@link ModelMapper} instance for object mapping
     */
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
