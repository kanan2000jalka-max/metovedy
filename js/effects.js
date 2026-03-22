window.EFFECTS = {
    // Эффекты очистки
    clearChat: () => {
        document.querySelector('.messages-wrapper').innerHTML = '';
    },

    // Эффекты затухания
    fadeIn: () => {
        document.body.classList.add('fade-in');
        setTimeout(() => document.body.classList.remove('fade-in'), 500);
    },

    fadeOut: () => {
        document.body.classList.add('fade-out');
    },

    // Звуки
    playAmbient: () => {
        playMusic('ambient.mp3', CONFIG.musicVolume);
    },

    // Инвентарь
    gainKey: () => {
        gameState.inventory.push('key');
        showNotification('Получен ключ!');
    },

    // Проверки
    hasKey: () => {
        return gameState.inventory.includes('key');
    },

    // Сложные эффекты
    earthquake: () => {
        document.querySelector('.game-container').classList.add('shake');
        playSound('earthquake.mp3');
        setTimeout(() => {
            document.querySelector('.game-container').classList.remove('shake');
        }, 2000);
    }
};