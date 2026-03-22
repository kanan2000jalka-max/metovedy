const Telegram = {
    init: function () {
        try {
            if (window.Telegram?.WebApp) {
                this.webapp = window.Telegram.WebApp;
                this.webapp.expand(); // Разворачиваем на весь экран
                this.webapp.disableVerticalSwipes(); // Запрещаем свайпы (чтоб не вылетали)

                // Тема Telegram
                this.theme = this.webapp.colorScheme || 'light';

                console.log('Telegram Mini App инициализирован');
                return true;
            }
        } catch (e) {
            console.log('Не в Telegram, работаем в браузере');
        }
        return false;
    },

    // Показать основную кнопку Telegram
    showMainButton: function (text, callback) {
        if (this.webapp) {
            this.webapp.MainButton.setText(text);
            this.webapp.MainButton.show();
            this.webapp.MainButton.onClick(callback);
        }
    },

    // Скрыть основную кнопку
    hideMainButton: function () {
        if (this.webapp) {
            this.webapp.MainButton.hide();
        }
    },

    // Закрыть приложение
    close: function () {
        if (this.webapp) {
            this.webapp.close();
        }
    }
};