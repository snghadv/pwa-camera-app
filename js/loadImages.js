(() => {
    function loadImages() {
        navigator.serviceWorker.controller.postMessage({
            msg: 'getImages'
        })
    }

    window.addEventListener('load', loadImages, false);
})();