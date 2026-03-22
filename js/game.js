// js/game.js

// Глобальное состояние игры
let gameState = {
    currentScene: null,
    settings: {
        typing: true,
        sound: true,
        music: true,
        clickHandler: null
    }
};

const CONFIG = {
    typingSpeeds: {
        slow: 100,
        normal: 20,
        fast: 0,
        instant: 0
    },
    textStyles: {
        default: 'message',
        thought: 'message thought',
        whisper: 'message whisper',
        shout: 'message shout'
    }
};

// Основной объект игры
const game = {
    // Текущий интервал печати
    currentTyping: null,

    // Инициализация
    init: function () {
        if (!window.SCENES) window.SCENES = {};

        if (typeof Telegram !== 'undefined') {
            Telegram.init();
        }

        this.load();
        this.showMenu();
    },

    // Загрузка сцены по ID
    loadScene: function (sceneId) {
        const scene = SCENES[sceneId];
        if (!scene) {
            console.error('Сцена не найдена:', sceneId);
            return;
        }

        if (this.currentTyping) {
            clearInterval(this.currentTyping);
            this.currentTyping = null;
        }

        gameState.currentScene = sceneId;

        const wrapper = document.querySelector('.messages-wrapper');
        if (wrapper) wrapper.innerHTML = '';

        const choicesContainer = document.getElementById('choices');
        if (choicesContainer) {
            choicesContainer.classList.remove('showing');
            choicesContainer.innerHTML = '';
        }

        if (scene.background) {
            document.getElementById('background').style.backgroundImage =
                `url('assets/images/backgrounds/${scene.background}')`;
        }

        if (scene.music && gameState.settings.music) {
            this.playMusic(scene.music);
        }

        if (scene.onStart && typeof scene.onStart === 'function') {
            scene.onStart();
        }

        if (scene.messages && scene.messages.length > 0) {
            this.showMessages(scene.messages, scene.onComplete);
        }
    },

    // Показать последовательность сообщений
    showMessages: function (messages, onComplete) {
        let index = 0;
        const scene = SCENES[gameState.currentScene];

        const showNext = () => {
            if (index < messages.length) {
                this.showMessage(messages[index], () => {
                    this.waitForClick(() => {
                        index++;
                        showNext();
                    });
                });
            } else {
                if (scene && scene.onEnd && typeof scene.onEnd === 'function') {
                    scene.onEnd();
                }
                if (onComplete && onComplete.type === 'choices') {
                    this.showChoices(onComplete.list);
                }
            }
        };

        showNext();
    },

    // Градиент
    showGradient: function () {
        const gradient = document.querySelector('.gradient-overlay');
        if (gradient) {
            gradient.classList.remove('expanded');
            gradient.classList.add('show');
        }
    },

    hideGradient: function () {
        const gradient = document.querySelector('.gradient-overlay');
        if (gradient) {
            gradient.classList.remove('show', 'expanded');
        }
    },

    expandGradient: function () {
        const gradient = document.querySelector('.gradient-overlay');
        if (gradient) {
            gradient.classList.add('show', 'expanded');
        }
    },

    shrinkGradient: function () {
        const gradient = document.querySelector('.gradient-overlay');
        if (gradient) {
            gradient.classList.remove('expanded');
        }
    },

    // Ожидание клика для продолжения
    waitForClick: function (callback) {
        if (this.clickHandler) {
            document.removeEventListener('click', this.clickHandler);
        }

        this.clickHandler = () => {
            document.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
            callback();
        };

        document.addEventListener('click', this.clickHandler);
    },

    // Показать одно сообщение
    showMessage: function (messageData, callback) {
        const wrapper = document.querySelector('.messages-wrapper');
        if (!wrapper) return;

        wrapper.innerHTML = '';

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';

        if (messageData.style && CONFIG.textStyles[messageData.style]) {
            messageDiv.classList.add(messageData.style);
        }

        wrapper.appendChild(messageDiv);

        let speed = CONFIG.typingSpeeds.normal;
        if (messageData.speed && CONFIG.typingSpeeds[messageData.speed]) {
            speed = CONFIG.typingSpeeds[messageData.speed];
        }

        if (gameState.settings.typing && speed > 0) {
            this.typeMessage(messageData.text, messageDiv, speed, callback);
        } else {
            messageDiv.textContent = messageData.text;
            if (callback) setTimeout(callback, 100);
        }
    },

    // Побуквенная печать (без пропуска)
    typeMessage: function (text, element, speed, callback) {
        let i = 0;
        element.textContent = '';

        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;

                const wrapper = document.querySelector('.messages-wrapper');
                if (wrapper) {
                    wrapper.scrollTop = wrapper.scrollHeight;
                }
            } else {
                clearInterval(typing);
                this.currentTyping = null;
                if (callback) callback();
            }
        }, speed);

        this.currentTyping = typing;
    },

    // Показать кнопки выбора
    showChoices: function (choices) {
        const container = document.getElementById('choices');
        if (!container) return;

        this.expandGradient();

        container.innerHTML = '';
        container.classList.add('showing');

        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-btn';

            if (choice.style) {
                button.classList.add(choice.style);
            }

            button.textContent = choice.text;

            let isProcessing = false;
            button.onclick = () => {
                if (isProcessing) return;
                isProcessing = true;

                this.shrinkGradient();
                container.classList.remove('showing');

                if (choice.next) {
                    this.loadScene(choice.next);
                }
            };

            container.appendChild(button);
        });
    },

    // Меню
    showMenu: function () {
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('choices').innerHTML = '';
    },

    hideMenu: function () {
        document.getElementById('menu').classList.add('hidden');
    },

    showSettings: function () {
        alert('Настройки будут позже');
    },

    newGame: function () {
        gameState = {
            currentScene: null,
            inventory: [],
            settings: gameState.settings
        };
        this.hideMenu();
        this.loadScene('prlg_01');
        this.save();
    },

    loadGame: function () {
        this.load();
        if (gameState.currentScene) {
            this.hideMenu();
            this.loadScene(gameState.currentScene);
        }
    },

    save: function () {
        try {
            localStorage.setItem('gameSave', JSON.stringify(gameState));
        } catch (e) {
            console.error('Ошибка сохранения:', e);
        }
    },

    load: function () {
        try {
            const saved = localStorage.getItem('gameSave');
            if (saved) {
                const parsed = JSON.parse(saved);
                gameState = { ...gameState, ...parsed };
            }
        } catch (e) {
            console.error('Ошибка загрузки:', e);
        }
    },

    playMusic: function (filename) {
        console.log('Играет музыка:', filename);
    }
};

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});