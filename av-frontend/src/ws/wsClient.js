/**
 * @file wsClient.js
 * @description Cliente WebSocket stub para conexión con backend.
 *              Funciones marcadas con TODO para integrar cuando
 *              el endpoint WS esté disponible.
 * @module ws/wsClient
 */

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

let socket = null;
let listeners = [];

/**
 * @callback WsMessageHandler
 * @param {Object} data - Datos parseados del mensaje recibido
 */

/**
 * Conecta al endpoint WebSocket del backend.
 * TODO: Implementar reconexión automática con backoff exponencial.
 * TODO: Agregar autenticación por token JWT en el handshake.
 *
 * @param {string} [url] - URL del WebSocket (opcional, usa VITE_WS_URL)
 * @returns {WebSocket} Instancia del socket conectado
 */
export function connect(url) {
  if (socket && socket.readyState === WebSocket.OPEN) return socket;

  const target = url || WS_URL;

  socket = new WebSocket(target);

  socket.addEventListener('open', () => {
    console.info('[ws] Conectado a', target);
    // TODO: Emitir evento de conexión exitosa para la UI
    // TODO: Enviar mensaje de autenticación inicial
  });

  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      listeners.forEach((fn) => fn(data));
    } catch {
      console.warn('[ws] Mensaje no JSON recibido:', event.data);
    }
  });

  socket.addEventListener('close', (event) => {
    console.info('[ws] Desconectado (código %d)', event.code);
    // TODO: Implementar lógica de reconexión aquí
  });

  socket.addEventListener('error', (err) => {
    console.error('[ws] Error de conexión:', err);
    // TODO: Notificar al usuario si la conexión falla repetidamente
  });

  return socket;
}

/**
 * Desconecta del WebSocket y limpia los listeners.
 * TODO: Notificar al backend antes de cerrar (mensaje de desconexión).
 */
export function disconnect() {
  if (socket) {
    socket.close(1000, 'Cliente cerrado');
    socket = null;
  }
  listeners = [];
}

/**
 * Envía un mensaje JSON al servidor a través del WebSocket.
 * TODO: Agregar cola de mensajes pendientes para cuando el socket
 *       no esté conectado (offline queue).
 *
 * @param {Object} payload - Datos a enviar
 * @returns {boolean} true si se envió correctamente, false en caso contrario
 */
export function send(payload) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('[ws] No se puede enviar: socket no conectado');
    // TODO: Encolar mensaje para reintentar al reconectar
    return false;
  }

  socket.send(JSON.stringify(payload));
  return true;
}

/**
 * Registra un callback para recibir mensajes del servidor.
 * TODO: Implementar suscripción por tipo de mensaje (canales/topics).
 *
 * @param {WsMessageHandler} fn - Función a ejecutar con cada mensaje recibido
 * @returns {() => void} Función para cancelar la suscripción
 */
export function onMessage(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

/**
 * Verifica si el socket está actualmente conectado.
 * @returns {boolean}
 */
export function isConnected() {
  return socket !== null && socket.readyState === WebSocket.OPEN;
}
