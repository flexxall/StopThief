window.StopThief = window.StopThief || {};

StopThief.ui = {
    updateDisplay(text, size = '38px') {
        const screen = document.getElementById('screen');
        screen.style.fontSize = size;
        screen.innerText = text;
    },

    pressOnButton() {
        const state = StopThief.state;
        const audio = StopThief.audio;

        audio.unlockAudioEngine();
        if (state.isProcessingMove) return;

        if (!state.isSystemPowered) {
            state.isSystemPowered = true;
            state.gameInProgress = false;
            state.soundDemoIndex = 0;
            state.lastDisplayedClue = '---';
            this.updateDisplay(state.lastDisplayedClue);
            setTimeout(() => { audio.playAuthenticSound('keypress'); }, 30);
            return;
        }

        audio.playAuthenticSound('keypress');
        state.crimeCount++;
        state.gameInProgress = true;
        state.isArresting = false;
        state.inputBuffer = '';

        const startingSector = Math.floor(Math.random() * 4) + 1;

        if (startingSector === 1) {
            const b1Crimes = [123, 144, 146, 164];
            state.thiefPosition = b1Crimes[Math.floor(Math.random() * b1Crimes.length)];
            state.lastDisplayedClue = '1 Cr';
        } else if (startingSector === 2) {
            const b2Crimes = [242, 245, 247, 265, 267];
            state.thiefPosition = b2Crimes[Math.floor(Math.random() * b2Crimes.length)];
            state.lastDisplayedClue = '2 Cr';
        } else if (startingSector === 3) {
            const b3Crimes = [337, 352, 355, 376];
            state.thiefPosition = b3Crimes[Math.floor(Math.random() * b3Crimes.length)];
            state.lastDisplayedClue = '3 Cr';
        } else {
            const b4Crimes = [425, 445, 463, 465, 467];
            state.thiefPosition = b4Crimes[Math.floor(Math.random() * b4Crimes.length)];
            state.lastDisplayedClue = '4 Cr';
        }

        this.updateDisplay(state.lastDisplayedClue);
        state.lastPosition = state.thiefPosition;
        setTimeout(() => { audio.playAuthenticSound('crime'); }, 220);
    },

    pressOffButton() {
        const state = StopThief.state;
        const audio = StopThief.audio;

        audio.unlockAudioEngine();
        if (!state.isSystemPowered || state.isProcessingMove) return;
        audio.playAuthenticSound('keypress');
        state.isSystemPowered = false;
        state.gameInProgress = false;
        state.soundDemoIndex = 0;
        state.crimeCount = 0;
        state.thiefPosition = 0;
        state.inputBuffer = '';
        state.isArresting = false;
        this.updateDisplay('');
    },

    getClue() {
        const state = StopThief.state;
        const audio = StopThief.audio;
        const movement = StopThief.movement;

        audio.unlockAudioEngine();
        if (!state.isSystemPowered || state.isArresting || state.isProcessingMove) return;

        if (!state.gameInProgress) {
            audio.playAuthenticSound('keypress');
            const sample = StopThief.constants.SOUND_DEMO_SAMPLES[state.soundDemoIndex];
            state.soundDemoIndex = (state.soundDemoIndex + 1) % StopThief.constants.SOUND_DEMO_SAMPLES.length;
            this.updateDisplay(sample.display);
            setTimeout(() => { audio.playAuthenticSound(sample.soundKey); }, 150);
            return;
        }

        audio.playAuthenticSound('keypress');

        const doesThiefStayStationary = Math.random() < 0.10;
        if (doesThiefStayStationary) {
            this.updateDisplay('');
            setTimeout(() => {
                this.updateDisplay(state.lastDisplayedClue);
                audio.playAuthenticSound('buzz');
            }, 100);
            return;
        }

        state.isProcessingMove = true;
        const moveResult = movement.executeThiefMove();
        const displayType = movement.getDisplayType(moveResult.id, moveResult.type);
        state.lastDisplayedClue = movement.formatDisplayString(moveResult.id, moveResult.type);

        setTimeout(() => {
            this.updateDisplay(state.lastDisplayedClue);
            audio.playSoundSync(displayType);
            state.isProcessingMove = false;
        }, 150);
    },

    showTip() {
        const state = StopThief.state;
        const audio = StopThief.audio;

        audio.unlockAudioEngine();
        if (!state.isSystemPowered || !state.gameInProgress || state.isArresting || state.isProcessingMove) return;
        audio.playAuthenticSound('tip');

        const valStr = state.thiefPosition.toString();
        this.updateDisplay(valStr.charAt(0) + ' ' + valStr.substring(1));
    },

    hideTip() {
        const state = StopThief.state;
        if (!state.isSystemPowered || !state.gameInProgress || state.isArresting || state.isProcessingMove) return;
        this.updateDisplay(state.lastDisplayedClue);
    },

    startArrest() {
        const state = StopThief.state;
        const audio = StopThief.audio;

        audio.unlockAudioEngine();
        if (!state.isSystemPowered || !state.gameInProgress || state.isProcessingMove) return;
        audio.playAuthenticSound('keypress');

        if (state.isArresting) {
            state.isArresting = false;
            state.inputBuffer = '';
            this.updateDisplay(state.lastDisplayedClue);
        } else {
            state.isArresting = true;
            state.inputBuffer = '';
            this.updateDisplay('Ar --');
        }
    },

    pressKey(num) {
        const state = StopThief.state;
        const audio = StopThief.audio;

        audio.unlockAudioEngine();
        if (!state.isSystemPowered || state.isProcessingMove) return;
        audio.playAuthenticSound('keypress');
        if (!state.isArresting) return;

        state.inputBuffer += num;
        this.updateDisplay('Ar ' + state.inputBuffer);

        if (state.inputBuffer.length === 3) {
            setTimeout(() => { this.evaluateArrest(); }, 150);
        }
    },

    evaluateArrest() {
        const state = StopThief.state;
        const audio = StopThief.audio;
        const movement = StopThief.movement;
        const ui = this;

        const attemptedGuess = parseInt(state.inputBuffer, 10);
        const isCorrectLocation = attemptedGuess === state.thiefPosition;

        this.updateDisplay('---', '38px');

        audio.soundLibrary.arrest_success.onended = null;
        audio.soundLibrary.arrest_fail.onended = null;
        audio.soundLibrary.arrest_taunt.onended = null;

        if (isCorrectLocation) {
            const doesCriminalFlee = Math.random() > 0.5;

            if (doesCriminalFlee) {
                audio.playAuthenticSound('arrest_taunt');
                state.isProcessingMove = true;

                audio.soundLibrary.arrest_taunt.onended = function () {
                    ui.updateDisplay('Escaped !!!', '38px');

                    const totalEscapeSteps = Math.random() > 0.5 ? 5 : 6;
                    let currentStep = 0;

                    function playEscapeClueSequence() {
                        if (currentStep >= totalEscapeSteps) {
                            state.isProcessingMove = false;
                            return;
                        }

                        const escapeStep = movement.executeThiefMove();
                        const displayType = movement.getDisplayType(escapeStep.id, escapeStep.type);
                        state.lastDisplayedClue = movement.formatDisplayString(escapeStep.id, escapeStep.type);
                        ui.updateDisplay(state.lastDisplayedClue, '38px');
                        audio.playSoundSync(displayType);

                        currentStep++;
                        setTimeout(playEscapeClueSequence, 2800);
                    }
                    setTimeout(playEscapeClueSequence, 2200);
                };
            } else {
                audio.playAuthenticSound('arrest_success');
                audio.soundLibrary.arrest_success.onended = function () {
                    ui.updateDisplay('Success !!!', '38px');
                    state.gameInProgress = false;
                };
            }
        } else {
            audio.playAuthenticSound('arrest_fail');
            audio.soundLibrary.arrest_fail.onended = function () {
                ui.updateDisplay('Failed !!!', '38px');
                setTimeout(() => {
                    if (state.isSystemPowered && state.gameInProgress) {
                        ui.updateDisplay(state.lastDisplayedClue, '38px');
                    }
                }, 2000);
            };
        }

        state.isArresting = false;
        state.inputBuffer = '';
    }
};

// Global handlers for inline onclick attributes
window.pressOnButton = () => StopThief.ui.pressOnButton();
window.pressOffButton = () => StopThief.ui.pressOffButton();
window.getClue = () => StopThief.ui.getClue();
window.showTip = () => StopThief.ui.showTip();
window.hideTip = () => StopThief.ui.hideTip();
window.startArrest = () => StopThief.ui.startArrest();
window.pressKey = (num) => StopThief.ui.pressKey(num);
