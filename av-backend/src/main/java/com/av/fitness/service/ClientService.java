package com.av.fitness.service;

import com.av.fitness.dto.coach.DietResponse;
import com.av.fitness.dto.coach.NoteResponse;
import com.av.fitness.dto.coach.RoutineResponse;
import com.av.fitness.dto.ProgressResponse;
import com.av.fitness.dto.ThreadResponse;
import java.util.List;
import java.util.UUID;

public interface ClientService {
    RoutineResponse getMyRoutine(UUID clientId);
    DietResponse getMyDiet(UUID clientId);
    List<ProgressResponse> getMyProgress(UUID clientId);
    ProgressResponse logProgress(UUID clientId, ProgressResponse request);
    void deleteProgress(UUID id);
    List<NoteResponse> getMyNotes(UUID clientId);
    ThreadResponse getMyThread(UUID clientId);
    ThreadResponse sendMessage(UUID clientId, String message);
}
