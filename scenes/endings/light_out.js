SCENES.light_out = {
    background: "blackground.jpg",
    music: "ambient.mp3",

    onEnter: "fadeIn",

    messages: [
        {
            text: "Действительно...",
            speed: "fast"
        },
        {
            text: "Оно тебе не нужно)",
            speed: "fast"
        },
        {
            text: "Не нужно открывать эту дверь)))",
            speed: "fast",
            style: "thought"
        }
    ],

    onComplete: {
        type: "choices",
        list: [
            {
                text: "Выключить свет",
                next: "drk",
            }
        ]
    }
};

SCENES.drk = {
    background: "000.png",
    music: "ambient.mp3",

    onEnter: "fadeIn",

    messages: [
        {
            text: "Свет погас",
            speed: "fast"
        },
        {
            text: "Осталась лишь беспросветная тьма",
            speed: "fast"
        },
        {
            text: "...",
            speed: "fast",
            style: "thought"
        }
    ],

    onComplete: {
        type: "choices",
        list: [
            {
                text: "Включить свет",
                next: "prlg_01",
            }
        ]
    }
};