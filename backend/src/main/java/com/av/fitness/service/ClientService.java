package com.av.fitness.service;

import com.av.fitness.dto.*;
import com.av.fitness.dto.client.ProgressRequest;
import com.av.fitness.dto.coach.*;
import com.av.fitness.dto.MessageResponse;

import java.util.List;

public interface ClientService {

    /** Obtiene la rutina asignada al cliente autenticado */
    RoutineResponse getMyRoutine(String clientId);

    /** Obtiene la dieta asignada al cliente autenticado */
    DietResponse getMyDiet(String clientId);

    /** Lista el historial de progreso del cliente autenticado */
    List<ProgressResponse> getMyProgress(String clientId);

    /** Registra una nueva entrada de progreso */
    ProgressResponse logProgress(String clientId, ProgressRequest request);

    /** Elimina una entrada de progreso por ID */
    void deleteProgress(String id);

    /** Obtiene las notas del cliente autenticado */
    List<NoteResponse> getMyNotes(String clientId);

    /** Obtiene el hilo de nutrición / IA del cliente */
    ThreadResponse getMyThread(String clientId);

    /** Envía un mensaje al hilo del cliente */
    MessageResponse sendMessage(String clientId, String text);
}
