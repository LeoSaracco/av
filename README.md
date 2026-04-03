# AV Fitness App - PaaS Mockup

Este proyecto es una plataforma interactiva "Platform as a Service" (PaaS) diseñada inicialmente para el coach Adrián Vila, con la capacidad de escalar a una arquitectura multi-coach en el futuro. Permite a los profesionales del fitness gestionar rutinas, hacer seguimiento del progreso y proveer planes nutricionales a sus clientes.

## Arquitectura y Stack
*   **Frontend**: React + Vite
*   **Estado & Persistencia**: Context API + `localStorage` (mockup de backend)
*   **Estilos**: Vanilla CSS con variables nativas, paleta dark mode premium "Glassmorphism" con acentos verde flúor.

## Módulo de Nutrición Bidireccional
La aplicación incluye un módulo de `DietTemplates` para Coaches y visualización simplificada para Clientes. Adicionalmente, cuenta con un chat/hilo de consultas asíncrono para dudas en tiempo real.

### 🤖 Integración Pendiente (Asistente IA Dedicado)
Se ha incorporado un submódulo independiente **"Asistente IA ✨"** (`/client/ai-assistant`) en el dashboard del cliente. El propósito es actuar como un chatbot inteligente que genera una "lluvia de ideas" de comidas sugeridas si el cliente no sabe qué comer y potenciar la experiencia. 

**Instrucciones para el equipo de Backend:**
Cuando se conecte una API/BD real, la funcionalidad de IA en el Cliente debe funcionar como un chatbot websocket o endpoint dedicado (ej. `/api/ai/chat`) que cumpla con los siguientes requisitos:
1.  **Contexto Inicial**: El cliente de React envía un prompt de sistema invisible a la IA junto con el objetivo nutricional actual (ej. "Entrenás a Martina, su objetivo es Volumen").
2.  **Llamada a LLM**: El servidor formula e interroga directamente al LLM (OpenAI, Claude, etc.) ante cada pregunta del cliente.
3.  **Persistencia Aislada**: El historial de charla con la IA debe guardarse internamente en la DB en una colección apartada (`ai_threads`) y NO mezclarse en el hilo general de Consultas humano.
4.  Actualmente la respuesta ("typing" y mensajería condicional por peso/volumen) está mockeada en el frontend local mediante `setTimeout`, pero la lógica decisional entera deberá trasladarse a la nube.

## Instalación Local
```bash
npm install
npm run dev
```
