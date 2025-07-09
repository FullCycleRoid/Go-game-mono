const isDevelopment = import.meta.env.DEV;
const useMock = import.meta.env.VITE_USE_MOCK === 'true';
const useLocalBackend = import.meta.env.VITE_USE_LOCAL_BACKEND === 'true';

export const config = {
  isDevelopment,
  useMock,
  useLocalBackend,
  
  // API URL
  apiUrl: useLocalBackend 
    ? 'http://localhost:8000/api'
    : 'https://your-production-api.com/api',
    
  // WebSocket URL (не используется, но оставляем для совместимости)
  wsUrl: useLocalBackend
    ? 'ws://localhost:8000'
    : 'wss://your-production-api.com',
}; 