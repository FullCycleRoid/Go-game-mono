// Простой логгер с поддержкой chainId и уровней логов
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogMeta {
  chainId?: string;
  [key: string]: any;
}

function formatMsg(level: LogLevel, msg: string, meta?: LogMeta) {
  const metaStr = meta ? JSON.stringify(meta) : '';
  return `[${level.toUpperCase()}] ${msg} ${metaStr}`;
}

/**
 * Логгер для отслеживания действий с поддержкой chainId.
 * @param msg Сообщение для логирования
 * @param meta Дополнительные метаданные (chainId и др.)
 */
export const logger = {
  info: (msg: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.info(formatMsg('info', msg, meta));
  },
  warn: (msg: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.warn(formatMsg('warn', msg, meta));
  },
  error: (msg: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.error(formatMsg('error', msg, meta));
  },
  debug: (msg: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.debug(formatMsg('debug', msg, meta));
  },
};

/**
 * Генерирует уникальный идентификатор цепочки действий (chainId).
 * @returns {string} chainId
 */
// Генерация уникального chainId (например, для новой цепочки действий)
export function generateChainId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
} 