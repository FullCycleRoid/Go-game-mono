/**
 * Сервис для работы с Telegram WebApp SDK.
 * Позволяет получать пользователя, id, показывать алерты, popup, управлять кнопками, темой и т.д.
 * Используйте singleton telegramService для доступа к методам.
 *
 * @example
 * import { telegramService } from './services/telegram';
 * const user = telegramService.getUser();
 */
import WebApp from '@twa-dev/sdk';
import { TelegramUser, TelegramWebApp } from './types';
import { logger } from './logger';

class TelegramService {
  private webApp: TelegramWebApp;

  constructor() {
    this.webApp = WebApp;
  }

  /**
   * Инициализация Telegram WebApp
   */
  init(): void {
    try {
      this.webApp.ready();
      this.webApp.expand();
    } catch (error) {
      logger.error('Ошибка инициализации Telegram WebApp', { error });
    }
  }

  /**
   * Получить пользователя Telegram
   */
  getUser(): TelegramUser | undefined {
    try {
      return this.webApp.initDataUnsafe?.user;
    } catch (error) {
      logger.error('Ошибка получения пользователя Telegram', { error });
      return undefined;
    }
  }

  /**
   * Получить Telegram ID пользователя
   */
  getUserId(): string | null {
    const user = this.getUser();
    return user ? user.id.toString() : null;
  }

  /**
   * Отправить данные в Telegram
   */
  sendData(data: any): void {
    try {
      this.webApp.sendData(JSON.stringify(data));
    } catch (error) {
      logger.error('Ошибка отправки данных в Telegram', { error });
    }
  }

  /**
   * Показать уведомление
   */
  showAlert(message: string): void {
    try {
      this.webApp.showAlert(message);
    } catch (error) {
      logger.error('Ошибка показа alert в Telegram', { error });
    }
  }

  /**
   * Показать подтверждение
   */
  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.webApp.showConfirm(message, (confirmed: boolean) => {
          resolve(confirmed);
        });
      } catch (error) {
        logger.error('Ошибка показа confirm в Telegram', { error });
        resolve(false);
      }
    });
  }

  /**
   * Показать всплывающее окно
   */
  showPopup(params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text: string }> }): Promise<string | null> {
    return new Promise((resolve) => {
      try {
        this.webApp.showPopup(params, (buttonId: string) => {
          resolve(buttonId);
        });
      } catch (error) {
        logger.error('Ошибка показа popup в Telegram', { error });
        resolve(null);
      }
    });
  }

  /**
   * Настроить главную кнопку
   */
  setupMainButton(text: string, callback: () => void): void {
    this.webApp.mainButton.setText(text);
    this.webApp.mainButton.onClick(callback);
    this.webApp.mainButton.show();
  }

  /**
   * Скрыть главную кнопку
   */
  hideMainButton(): void {
    this.webApp.mainButton.hide();
  }

  /**
   * Настроить кнопку "Назад"
   */
  setupBackButton(callback: () => void): void {
    this.webApp.backButton.onClick(callback);
    this.webApp.backButton.show();
  }

  /**
   * Скрыть кнопку "Назад"
   */
  hideBackButton(): void {
    this.webApp.backButton.hide();
  }

  /**
   * Получить тему
   */
  getTheme(): 'light' | 'dark' {
    return this.webApp.colorScheme;
  }

  /**
   * Получить параметры темы
   */
  getThemeParams() {
    return this.webApp.themeParams;
  }

  /**
   * Проверить, запущено ли в Telegram
   */
  isTelegramWebApp(): boolean {
    return typeof this.webApp !== 'undefined' && this.webApp.initData !== undefined;
  }

  /**
   * Получить start параметр
   */
  getStartParam(): string | undefined {
    return this.webApp.initDataUnsafe?.start_param;
  }
}

export const telegramService = new TelegramService();
export default telegramService; 