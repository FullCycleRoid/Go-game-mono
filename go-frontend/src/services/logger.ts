/**
 * Простой сервис логирования с поддержкой chainId и уровней логов.
 * Используйте методы logger.info, logger.warn, logger.error, logger.debug для логирования.
 */
import { LogLevel, LogMeta } from './types';

function formatMsg(level: LogLevel, msg: string, meta?: LogMeta) {
  const metaStr = meta ? JSON.stringify(meta) : '';
  return `[${level.toUpperCase()}] ${msg} ${metaStr}`;
}

/**
 * Логгер для отслеживания действий с поддержкой chainId.
 */
export const logger = {
  /**
   * Лог уровня info
   */
  info: (msg: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.info(formatMsg('info', msg, meta));
  },
  /**
   * Лог уровня warn
   */
  warn: (msg: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.warn(formatMsg('warn', msg, meta));
  },
  /**
   * Лог уровня error
   */
  error: (msg: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.error(formatMsg('error', msg, meta));
  },
  /**
   * Лог уровня debug
   */
  debug: (msg: string, meta?: LogMeta) => {
    // eslint-disable-next-line no-console
    console.debug(formatMsg('debug', msg, meta));
  },
};

/**
 * Генерирует уникальный идентификатор цепочки действий (chainId).
 * @returns {string} chainId
 */
export function generateChainId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
} 