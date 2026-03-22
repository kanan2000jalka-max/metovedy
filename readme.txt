При создании использовался ии

telegram-game/
│
├── index.html              // Главная страница
├── manifest.json           // Для красивого отображения в Telegram
│
├── css/
│   └── style.css           // Все стили игры
│
├── js/
│   ├── game.js             // движок
│   ├── config.js           // Настройки 
│   ├── effects.js          // Библиотека эффектов
│   └── telegram.js         // Telegram-специфичные функции   
│
├── scenes/                 // Сцены по папкам
│   ├── prologue/        
│   │   ├── 01_start.js
│   │   ├── 02_experiment.js
│   │   └── 03_awakening.js
│   │
│   ├── backroom/
│   │   └── xxx.js
│   │
│   └── endings/
│       ├── good.js
│       └── bad.js
│
└── assets/
    ├── images/
    │   ├── backgrounds/    // Фоны
    │   └── illustrations/  // Кнопки, иконки
    └── audio/
        ├── music/          // Фоновая музыка
        └── sfx/            // Звуковые эффекты


