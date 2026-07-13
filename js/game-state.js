window.StopThief = window.StopThief || {};

StopThief.board = {};

StopThief.state = {
    isSystemPowered: false,
    gameInProgress: false,
    crimeCount: 0,
    thiefPosition: 0,
    inputBuffer: "",
    isArresting: false,
    audioUnlocked: false,
    lastPosition: 0,
    lastDisplayedClue: "---",
    isProcessingMove: false,
    soundDemoIndex: 0
};

StopThief.constants = {
    SUBWAY_IDS: [500, 599, 699, 799, 899],
    CORNER_SUBWAY_IDS: [599, 699, 799, 899],
    BUILDING_CRIMES: {
        1: [123, 144, 146, 164],
        2: [242, 245, 247, 265, 267],
        3: [337, 352, 355, 376],
        4: [425, 445, 463, 465, 467]
    },
    SOUND_DEMO_SAMPLES: [
        { display: "- Cr", soundKey: "crime" },
        { display: "- Fl", soundKey: "footsteps" },
        { display: "- Dr", soundKey: "door" },
        { display: "- Gl", soundKey: "glass" },
        { display: "- St", soundKey: "street" },
        { display: "- Sb", soundKey: "subway" }
    ]
};
