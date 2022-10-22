(() => {
    const create_UUID = () => {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    let streaming = false;

    let video = null;
    let photo = null;
    let canvas = null;
    let captureButton = null;
    let confirmButton = null;
    let retakeButton = null;
    let photoId = create_UUID();

    function startup() {
        console.log("aaaa");
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        captureButton = document.getElementById('capture-button');
        confirmButton = document.getElementById('confirm-button');
        retakeButton = document.getElementById('retake-button');

        confirmButton.style.display = 'none';
        confirmButton.style.visibility = 'hidden';
        retakeButton.style.display = 'none';
        retakeButton.style.visibility = 'hidden';

        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment'
            }, audio: false
        })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error(`An error occurred: ${err}`);
            });

        video.addEventListener('canplay', (event) => {
            if (!streaming) {
                streaming = true;
            }
        }, false);

        captureButton.addEventListener('click', (event) => {
            takepicture();
            event.preventDefault();
        }, false);

        confirmButton.addEventListener('click', (event) => {
            console.log('forwarded');
        })

        retakeButton.addEventListener('click', (event) => {
            retakePicuture();
        })
    }

    function takepicture() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);

        navigator.serviceWorker.controller.postMessage({
            msg: 'uploadImage',
            body: {
                id: photoId,
                imgblob: data
            }
        })

        video.style.display = 'none';
        video.style.visibility = 'hidden';
        canvas.style.display = 'none';
        canvas.style.visibility = 'hidden';
        captureButton.style.display = 'none';
        captureButton.style.visibility = 'hidden';
        photo.style.display = 'block';
        photo.style.visibility = 'visible';
        confirmButton.style.display = 'inline-block';
        confirmButton.style.visibility = 'visible';
        retakeButton.style.visibility = 'visible';
        retakeButton.style.display = 'inline-block';
    }

    function retakePicuture() {
        photo.style.display = 'none';
        photo.style.visibility = 'hidden';
        captureButton.style.display = 'inline-block';
        captureButton.style.visibility = 'visible';
        video.style.display = 'inline-block';
        video.style.visibility = 'visible';
        startup();
    }

    window.addEventListener('load', startup, false);
})();