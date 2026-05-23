import axios from 'axios';

// Base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Send a chat message to the bot
 * @param {string} message - User's message
 * @param {string} sessionId - Session ID for conversation memory
 * @returns {Promise<{reply: string, language: string, session_id: string}>}
 */
export const sendMessage = async (message, sessionId) => {
  const response = await api.post('/api/chat/', {
    message,
    session_id: sessionId,
  });
  return response.data;
};

/**
 * Get conversation history
 * @param {string} [sessionId] - Optional session ID to filter
 * @returns {Promise<Array>}
 */
export const getHistory = async (sessionId) => {
  const params = sessionId ? { session_id: sessionId } : {};
  const response = await api.get('/api/history/', { params });
  return response.data;
};

/**
 * Save a conversation log entry
 * @param {Object} logData - Log data to save
 * @returns {Promise<{status: string, session_id: string}>}
 */
export const saveLog = async (logData) => {
  const response = await api.post('/api/save-log/', logData);
  return response.data;
};

export default api;
