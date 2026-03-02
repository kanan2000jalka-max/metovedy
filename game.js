// ========================
// game.js - КАРКАС ДЛЯ ТВОЕЙ ИСТОРИИ
// ========================

// ----- Telegram интеграция -----
let tg = null;
try {
    tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand();
    }
} catch (e) {
    console.log("Обычный браузер");
}

// ----- СОСТОЯНИЕ ИГРЫ -----
// Здесь хранятся все переменные игры
const gameState = {
    currentScene: "start",      // Текущая сцена
//    health: 100,                // Здоровье игрока
//    inventory: [],              // Инвентарь (массив предметов)
    flags: {},                  // Флаги для сложных условий (можно добавлять любые)
    savedAt: null               // Время последнего сохранения
};

// ----- БАЗА ДАННЫХ ИСТОРИИ -----
// СЮДА ТЫ БУДЕШЬ ДОБАВЛЯТЬ СВОИ СЦЕНЫ
const scenes = {
    // ===== НАЧАЛО ИСТОРИИ =====
    "start": {
        // Фоновое изображение (можно менять для каждой сцены)
        background: "url('https://example.com/forest.jpg')",
        
        // Текст сцены (будет печататься побуквенно)
        text: "Ты просыпаешься в густом тумане. Голова гудит, а последнее, что помнишь - это как ты заходил в этот странный лес. Вокруг тихо, лишь где-то вдалеке слышен вой.",
        
        // Варианты выбора
        choices: [
            { 
                text: "🔍 Осмотреться вокруг",           // Текст кнопки
                nextScene: "examine_area",                // Куда ведет
                style: "peaceful",                         // Стиль кнопки (peaceful, danger, mystical)
                effect: () => {                             // Что происходит при выборе
                    // Здесь можно добавить эффект
                    console.log("Осмотрелся");
                }
            },
            { 
                text: "🚶 Пойти на звук воя", 
                nextScene: "go_to_howling",
                style: "danger",
                effect: () => {
                    gameState.flags.heardHowling = true;   // Пример установки флага
                }
            },
            { 
                text: "🧘 Остаться на месте и ждать", 
                nextScene: "wait",
                style: "mystical"
            }
        ]
    },
    
    // ===== СЦЕНА: ОСМОТРЕТЬСЯ =====
    "examine_area": {
        background: "url('https://example.com/forest-clearing.jpg')",
        text: "Оглядевшись, ты замечаешь старую тропинку, уходящую вглубь леса, и догорающий костер неподалеку. У костра лежит чей-то рюкзак.",
        
        choices: [
            { 
                text: "🔥 Подойти к костру", 
                nextScene: "campfire",
                style: "peaceful"
            },
            { 
                text: "🌲 Пойти по тропинке", 
                nextScene: "path",
                style: "mystical"
            }
        ]
    },
    
    // ===== СЦЕНА: ПОДОЙТИ К КОСТРУ =====
    "campfire": {
        background: "url('https://example.com/campfire.jpg')",
        text: "Ты подходишь к костру. Он еще теплый. В рюкзаке ты находишь флягу с водой и карту местности.",
        
        choices: [
            { 
                text: "💧 Взять флягу и карту", 
                nextScene: "path",
                style: "peaceful",
                effect: () => {
                    gameState.inventory.push("Фляга с водой");
                    gameState.inventory.push("Карта");
                    gameState.health += 10;  // Вода прибавила сил
                }
            }
        ]
    },
    
    // ===== СЦЕНА: ПУТЬ В НИКУДА (пример с условием) =====
    "path": {
        background: "url('https://example.com/dark-path.jpg')",
        text: "Ты идешь по тропинке. " + (gameState.inventory.includes("Карта") ? 
            "Благодаря карте ты уверен в направлении." : 
            "Без карты ты чувствуешь, что заблудился."),
        
        choices: [
            { 
                text: "Идти дальше", 
                nextScene: "next_location",
                style: "mystical"
            }
        ]
    },
    
    // ===== ПРИМЕР СЦЕНЫ С ПРОВЕРКОЙ ИНВЕНТАРЯ =====
    "next_location": {
        background: "url('https://example.com/cave.jpg')",
        text: "Ты выходишь к пещере. Вход охраняет огромный медведь.",
        
        // Динамические варианты в зависимости от инвентаря
        getChoices: function() {
            const choices = [
                { 
                    text: "⚔️ Атаковать медведя", 
                    nextScene: "bear_fight",
                    style: "danger"
                }
            ];
            
            // Если есть фляга, можно отвлечь медведя
            if (gameState.inventory.includes("Фляга с водой")) {
                choices.push({
                    text: "💧 Отвлечь медведя водой",
                    nextScene: "sneak_past",
                    style: "peaceful",
                    effect: () => {
                        gameState.inventory = gameState.inventory.filter(i => i !== "Фляга с водой");
                    }
                });
            }
            
            return choices;
        }
    },
    
    // ===== СЦЕНА С ПОТЕРЕЙ ЗДОРОВЬЯ =====
    "bear_fight": {
        background: "url('https://example.com/bear-attack.jpg')",
        text: "Медведь оказался сильнее. Ты получаешь серьезные раны, но успеваешь убежать.",
        
        choices: [
            { 
                text: "🏃 Убежать в лес", 
                nextScene: "injured",
                style: "danger",
                effect: () => {
                    gameState.health -= 40;
                }
            }
        ]
    },
    
    // ===== СЦЕНА: РАНЕНЫЙ =====
    "injured": {
        background: "url('https://example.com/bleeding.jpg')",
        text: "Ты ранен и истекаешь кровью. Нужно перевязать рану.",
        
        choices: [
            { 
                text: "🩹 Перевязать рану тканью", 
                nextScene: "healed",
                style: "peaceful",
                effect: () => {
                    gameState.health += 20;
                }
            }
        ]
    },
    
    // ===== СЦЕНА: ИСЦЕЛЕНИЕ =====
    "healed": {
        background: "url('https://example.com/clearing.jpg')",
        text: "Тебе удалось остановить кровь. Ты выжил!",
        
        choices: [
            { 
                text: "🔄 Начать сначала", 
                nextScene: "start",
                style: "mystical",
                effect: () => {
                    // Полный сброс игры
                    gameState.health = 100;
                    gameState.inventory = [];
                    gameState.flags = {};
                }
            }
        ]
    },
    
    // ===== СЦЕНА: КОНЦОВКА =====
    "sneak_past": {
        background: "url('https://example.com/cave-entrance.jpg')",
        text: "Ты проскальзываешь мимо медведя и входишь в пещеру. Внутри ты находишь сокровища! Ты победил!",
        
        choices: [
            { 
                text: "🏆 Начать новую историю", 
                nextScene: "start",
                style: "peaceful",
                effect: () => {
                    gameState.health = 100;
                    gameState.inventory = [];
                    gameState.flags = {};
                }
            }
        ]
    }
};

// ----- СЛУЖЕБНЫЕ ФУНКЦИИ (НЕ ТРОГАТЬ) -----

// Функция печати текста побуквенно
async function typeText(element, text, speed = 30) {
    return new Promise(resolve => {
        element.innerHTML = '';  // Очищаем
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();  // Печать закончена
            }
        }
        
        type();
    });
}

// Главная функция загрузки сцены
async function loadScene(sceneId) {
    try {
        // Получаем сцену
        let scene = scenes[sceneId];
        if (!scene) scene = scenes["start"];
        
        // Обновляем фон
        const bgElement = document.getElementById("background");
        if (scene.background && bgElement) {
            bgElement.style.backgroundImage = scene.background;
        }
        
        // Печатаем текст
        const textElement = document.getElementById("scene-text");
        if (textElement) {
            await typeText(textElement, scene.text || "...", 30);
        }
        
        // Получаем варианты выбора
        let choices = scene.choices;
        if (scene.getChoices) {
            choices = scene.getChoices();  // Для динамических сцен
        }
        
        // Создаем кнопки
        const choicesContainer = document.getElementById("choices");
        if (choicesContainer) {
            // Очищаем контейнер
            while (choicesContainer.firstChild) {
                choicesContainer.removeChild(choicesContainer.firstChild);
            }
            
            // Создаем кнопки
            if (choices && choices.length > 0) {
                for (let i = 0; i < choices.length; i++) {
                    const choice = choices[i];
                    
                    // Небольшая задержка для красивой анимации
                    await new Promise(r => setTimeout(r, 100));
                    
                    const button = document.createElement("button");
                    button.className = "choice-btn";
                    if (choice.style) {
                        button.classList.add(choice.style);
                    }
                    button.textContent = choice.text;
                    
                    button.onclick = () => {
                        try {
                            // Применяем эффект
                            if (choice.effect) {
                                choice.effect();
                            }
                            
                            // Переходим к следующей сцене
                            if (choice.nextScene) {
                                loadScene(choice.nextScene);
                            }
                            
                            // Обновляем статистику
                            updateStats();
                            
                            // Автосохранение
                            saveGame();
                            
                        } catch (error) {
                            console.error("Ошибка:", error);
                        }
                    };
                    
                    choicesContainer.appendChild(button);
                }
            }
        }
        
        // Обновляем статистику
        updateStats();
        
    } catch (error) {
        console.error("Критическая ошибка:", error);
    }
}

// Обновление статистики
function updateStats() {
    const healthElement = document.getElementById("health");
    const inventoryElement = document.getElementById("inventory");
    
    if (healthElement) {
        healthElement.textContent = `❤️ ${Math.max(0, gameState.health)} HP`;
    }
    
    if (inventoryElement) {
        const items = gameState.inventory.length > 0 
            ? gameState.inventory.join(" • ") 
            : "пусто";
        inventoryElement.textContent = `🎒 ${items}`;
    }
    
    // Проверка смерти
    if (gameState.health <= 0) {
        setTimeout(() => loadScene("death"), 1000);
    }
}

// Сохранение игры
function saveGame() {
    try {
        gameState.savedAt = new Date().toISOString();
        localStorage.setItem('textGameSave', JSON.stringify(gameState));
        console.log("Игра сохранена");
    } catch (e) {
        console.log("Не удалось сохранить");
    }
}

// Загрузка сохранения
function loadSavedGame() {
    try {
        const saved = localStorage.getItem('textGameSave');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(gameState, parsed);
            return true;
        }
    } catch (e) {
        console.log("Нет сохранения");
    }
    return false;
}

// Инициализация игры
document.addEventListener("DOMContentLoaded", async function() {
    // Спрашиваем, хочет ли игрок загрузить сохранение
    if (loadSavedGame()) {
        // Можно добавить диалог, но для простоты просто загружаем
        loadScene(gameState.currentScene);
    } else {
        loadScene("start");
    }
});

// Добавляем сцену смерти
scenes["death"] = {
    background: "url('https://example.com/death.jpg')",
    text: "💀 Ты погиб... Игра окончена.",
    choices: [
        {
            text: "🔄 Начать заново",
            nextScene: "start",
            effect: () => {
                gameState.health = 100;
                gameState.inventory = [];
                gameState.flags = {};
            }
        }
    ]
};
