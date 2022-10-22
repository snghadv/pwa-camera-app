if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("sw.js").then((reg) => {
        console.log("Service Worker Registered", reg);
    }).catch((err) => {
        console.log("Unable to register service worker", err);
    });

    navigator.serviceWorker.addEventListener('message', event => {
        console.log(event, 'client event');
        let divElement = document.getElementById('images-list');
        event.data.map(val => {
            divElement.innerHTML += getCard(val.image, val.id)
        })
    })
}

const getCard = (imgUrl, id) => {
    let html = `<div key = "${id}" class="card-panel camera teal lighten-4 valign center" style="display: block;">
    <img src="${imgUrl}" alt="camera thumb" class="img-card">
    <div style="text-align: center;">
        <a class="btn-floating btn-small btn-large delete-btn" style="margin-top: 15px;" onclick="deleteImage('${id}')">
          <i class="material-icons">delete_outline</i>
        </a>
      </div>
  </div>`;

    return html;
}

function deleteImage(id) {
    navigator.serviceWorker.controller.postMessage({
        msg: 'deleteImage',
        body: {
            id: id
        }
    });

    window.location = "/pwa-camera-app/pages/deleteFinal.html";
}
