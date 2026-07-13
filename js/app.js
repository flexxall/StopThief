window.StopThief = window.StopThief || {};

StopThief.app = {
    init() {
        StopThief.initializeBoard();
        document.addEventListener('mouseup', () => StopThief.ui.hideTip());
        document.addEventListener('touchend', () => StopThief.ui.hideTip());
        this.registerServiceWorker();
    },

    registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('service-worker.js').catch(() => {});
    }
};

document.addEventListener('DOMContentLoaded', () => {
    StopThief.app.init();
});
