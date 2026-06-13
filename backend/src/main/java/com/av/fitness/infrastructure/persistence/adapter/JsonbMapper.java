package com.av.fitness.infrastructure.persistence.adapter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.av.fitness.domain.model.Exercise;
import com.av.fitness.domain.model.Meal;

import java.util.Collections;
import java.util.List;

public final class JsonbMapper {

    private static final ObjectMapper MAPPER = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    private JsonbMapper() {}

    public static ObjectMapper getMapper() {
        return MAPPER;
    }

    public static String toJson(Object obj) {
        if (obj == null) return null;
        try {
            return MAPPER.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializando JSONB", e);
        }
    }

    public static List<Exercise> parseExercises(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return MAPPER.readValue(json, new TypeReference<List<Exercise>>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }

    public static List<Meal> parseMeals(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return MAPPER.readValue(json, new TypeReference<List<Meal>>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }
}
