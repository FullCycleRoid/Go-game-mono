import WebApp from '@twa-dev/sdk';

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    chat?: any;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  backButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  mainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setText: (text: string) => void;
    setParams: (params: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text: string }> }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params: { text?: string }, callback?: (data: string) => void) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (data: string) => void) => void;
  requestWriteAccess: (callback?: (access: boolean) => void) => void;
  requestContact: (callback?: (contact: { phone_number: string; first_name: string; last_name?: string; user_id?: number }) => void) => void;
  invokeCustomMethod: (method: string, params?: any) => void;
  isVersionAtLeast: (version: string) => boolean;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
}

class TelegramService {
  private webApp: any;

  constructor() {
    this.webApp = WebApp;
  }

  // Инициализация Telegram WebApp
  init(): void {
    this.webApp.ready();
    this.webApp.expand();
  }

  // Получить пользователя
  getUser(): TelegramUser | undefined {
    return this.webApp.initDataUnsafe?.user;
  }

  // Получить Telegram ID пользователя
  getUserId(): string | null {
    const user = this.getUser();
    return user ? user.id.toString() : null;
  }

  // Отправить данные в Telegram
  sendData(data: any): void {
    this.webApp.sendData(JSON.stringify(data));
  }

  // Показать уведомление
  showAlert(message: string): void {
    this.webApp.showAlert(message);
  }

  // Показать подтверждение
  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.webApp.showConfirm(message, (confirmed: boolean) => {
        resolve(confirmed);
      });
    });
  }

  // Показать всплывающее окно
  showPopup(params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text: string }> }): Promise<string | null> {
    return new Promise((resolve) => {
      this.webApp.showPopup(params, (buttonId: string) => {
        resolve(buttonId);
      });
    });
  }

  // Настроить главную кнопку
  setupMainButton(text: string, callback: () => void): void {
    this.webApp.mainButton.setText(text);
    this.webApp.mainButton.onClick(callback);
    this.webApp.mainButton.show();
  }

  // Скрыть главную кнопку
  hideMainButton(): void {
    this.webApp.mainButton.hide();
  }

  // Настроить кнопку "Назад"
  setupBackButton(callback: () => void): void {
    this.webApp.backButton.onClick(callback);
    this.webApp.backButton.show();
  }

  // Скрыть кнопку "Назад"
  hideBackButton(): void {
    this.webApp.backButton.hide();
  }

  // Получить тему
  getTheme(): 'light' | 'dark' {
    return this.webApp.colorScheme;
  }

  // Получить параметры темы
  getThemeParams() {
    return this.webApp.themeParams;
  }

  // Проверить, запущено ли в Telegram
  isTelegramWebApp(): boolean {
    return typeof this.webApp !== 'undefined' && this.webApp.initData !== undefined;
  }

  // Получить start параметр
  getStartParam(): string | undefined {
    return this.webApp.initDataUnsafe?.start_param;
  }
}

// Создаем единственный экземпляр сервиса
export const telegramService = new TelegramService();

export default telegramService; 