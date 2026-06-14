package com.av.fitness.service;

import com.av.fitness.dto.MessageResponse;
import com.av.fitness.dto.OnboardingRequest;

public interface OnboardingService {

    /** Guarda los datos del formulario de onboarding */
    MessageResponse submit(OnboardingRequest request);
}
