SCENES.prlg_ххх = {
    background: "001.png",
    music: "ambient.mp3",

    messages: [
        {
            text: "ххх",
            speed: "normal"
        },
        {
            text: "ххх",
            speed: "slow"
        },
        {
            text: "ххх",
            speed: "normal"
        }

    ],

    onComplete: {
        type: "choices",
        list: [
            {
                text: "х",
                next: "prlg_ххх",
            },
            {
                text: "хх",
                next: "prlg_ххх",
            },
            {
                text: "ххх",
                next: "prlg_ххх",
            }
        ]
    }
};