package com.av.fitness.service;

import com.av.fitness.dto.coach.DietResponse;
import com.av.fitness.dto.coach.NoteResponse;
import com.av.fitness.dto.coach.RoutineResponse;
import com.av.fitness.dto.ProgressResponse;
import com.av.fitness.dto.ThreadResponse;
import java.util.List;
import java.util.UUID;

/**
 * Handles client-side operations including routines, diets, progress tracking,
 * coach notes, and messaging threads.
 */
public interface ClientService {

    /**
     * Retrieves the routine assigned to the specified client.
     *
     * @param clientId the client's UUID
     * @return RoutineResponse containing the client's assigned routine
     */
    RoutineResponse getMyRoutine(UUID clientId);

    /**
     * Retrieves the diet plan assigned to the specified client.
     *
     * @param clientId the client's UUID
     * @return DietResponse containing the client's assigned diet plan
     */
    DietResponse getMyDiet(UUID clientId);

    /**
     * Retrieves all progress entries for the specified client.
     *
     * @param clientId the client's UUID
     * @return list of ProgressResponse entries
     */
    List<ProgressResponse> getMyProgress(UUID clientId);

    /**
     * Logs a new progress entry for the specified client.
     *
     * @param clientId the client's UUID
     * @param request  the progress data to log
     * @return ProgressResponse the saved progress entry
     */
    ProgressResponse logProgress(UUID clientId, ProgressResponse request);

    /**
     * Updates an existing progress entry.
     *
     * @param id      the progress entry UUID
     * @param request the updated progress data
     * @return ProgressResponse the updated progress entry
     */
    ProgressResponse updateProgress(UUID id, ProgressResponse request);

    /**
     * Deletes a progress entry.
     *
     * @param id the progress entry UUID to delete
     */
    void deleteProgress(UUID id);

    /**
     * Retrieves all coach notes for the specified client.
     *
     * @param clientId the client's UUID
     * @return list of NoteResponse entries for the client
     */
    List<NoteResponse> getMyNotes(UUID clientId);

    /**
     * Retrieves the messaging thread for the specified client.
     *
     * @param clientId the client's UUID
     * @return ThreadResponse containing the messaging thread
     */
    ThreadResponse getMyThread(UUID clientId);

    /**
     * Sends a message in the specified client's thread.
     *
     * @param clientId the client's UUID
     * @param message  the message text
     * @return ThreadResponse containing the updated thread
     */
    ThreadResponse sendMessage(UUID clientId, String message);
}
