window.StopThief = window.StopThief || {};

const AUDIO_PATH = 'assets/audio/';

StopThief.audio = {
    soundLibrary: {
        footsteps: new Audio(AUDIO_PATH + 'footsteps.mp3'),
        door: new Audio(AUDIO_PATH + 'door.mp3'),
        glass: new Audio(AUDIO_PATH + 'glass.mp3'),
        street: new Audio(AUDIO_PATH + 'street.mp3'),
        keypress: new Audio(AUDIO_PATH + 'keypress.mp3'),
        crime: new Audio(AUDIO_PATH + 'crime.mp3'),
        tip: new Audio(AUDIO_PATH + 'tip.mp3'),
        arrest_success: new Audio(AUDIO_PATH + 'arrest_success.mp3'),
        arrest_fail: new Audio(AUDIO_PATH + 'arrest_fail.mp3'),
        arrest_taunt: new Audio(AUDIO_PATH + 'arrest_taunt.mp3')
    },

    unlockAudioEngine() {
        const state = StopThief.state;
        if (state.audioUnlocked) return;
        state.audioUnlocked = true;
        for (const key in this.soundLibrary) {
            this.soundLibrary[key].play().then(() => {
                this.soundLibrary[key].pause();
                this.soundLibrary[key].currentTime = 0;
            }).catch(() => {});
        }
    },

    playSoundSync(type) {
        if (type === 'Cr') this.playAuthenticSound('crime');
        else if (type === 'Gl') this.playAuthenticSound('glass');
        else if (type === 'Dr') this.playAuthenticSound('door');
        else if (type === 'St') this.playAuthenticSound('street');
        else this.playAuthenticSound('footsteps');
    },

    playAuthenticSound(soundKey) {
        if (soundKey === 'subway') {
            if (typeof playSounds === 'function' && typeof sounds !== 'undefined') {
                playSounds([sounds.Subway]);
            }
            return;
        }

        if (soundKey === 'buzz') {
            soundKey = 'keypress';
        }

        const audioTrack = this.soundLibrary[soundKey];
        if (audioTrack) {
            audioTrack.currentTime = 0;
            audioTrack.volume = 1.0;
            audioTrack.play().catch(() => {});
        }
    }
};
