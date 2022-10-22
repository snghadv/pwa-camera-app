const cacheName = "app-shell-rsrs";
const dynamicCacheName = "dynamic-cache";
const idbName = "wpadb";
let db;
const storeName = "wps-images";

const assets = [
    "/",
    "index.html",
    "js/app.js",
    "js/common.js",
    "js/materialize.min.js",
    "css/styles.css",
    "css/materialize.min.css",
    "img/icons/icons8-camera-512.png",
    "/img/icons/icons8-camera-192.png",
    "/manifest.json",
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v139/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
]


const openConnection = () => {
    if (db) return;
    const DBOpenRequest = indexedDB.open(idbName, 4);
    DBOpenRequest.onsuccess = (event) => {
        db = DBOpenRequest.result;
    };
    DBOpenRequest.onupgradeneeded = (event) => {
        db = event.target.result;
        db.onerror = (event) => {
            console.log("Update to connect to indexeddb")
        };

        db.createObjectStore(storeName, { keyPath: "id" });
    }
    DBOpenRequest.onerror = (event) => {
        console.log("Update to connect to indexeddb")
    }
}


self.addEventListener("install", (event) => {
    if (self.indexedDB) {
        event.waitUntil(openConnection());
    }
})

self.addEventListener('activate', event => {
    console.log("Service worker activated");
})

self.addEventListener('message', event => {
    const { body, msg } = event.data;

    if (msg === 'uploadImage') {
        event.waitUntil(openConnection());
        const transaction = db.transaction([storeName], "readwrite");
        transaction.oncomplete = (evt) => {
            console.log("Db modification done");
        };
        transaction.onerror = (evt) => {
            console.log("Db update not done", evt);
        };
        const objectStore = transaction.objectStore(storeName);
        const objectStoreRequest = objectStore.put({
            id: body?.id,
            image: body?.imgblob
        });

        objectStoreRequest.onsuccess = (evt) => {
            console.log("Inserted Image");
        };
    } else if (msg === 'getImages') {
        event.waitUntil(openConnection());
        const transaction = db.transaction([storeName], "readwrite");
        transaction.oncomplete = (evt) => {
            console.log("Db modification done");
        };
        transaction.onerror = (evt) => {
            console.log("Db update not done", evt);
        };

        const objectStore = transaction.objectStore(storeName);
        const result = objectStore.getAll();
        result.onsuccess = (evt) => {
            self.clients.matchAll().then(clients => {
                clients.forEach(client => client.postMessage(result.result));
            })
        };
    } else if (msg === 'deleteImage') {
        console.log("delete");
        event.waitUntil(openConnection());
        const transaction = db.transaction([storeName], "readwrite");
        transaction.oncomplete = (evt) => {
            console.log("Db modification done");
        };
        transaction.onerror = (evt) => {
            console.log("Db update not done", evt);
        };

        const objectStore = transaction.objectStore(storeName);
        const result = objectStore.delete(body?.id);
        result.onsuccess = (evt) => {
            self.clients.matchAll().then(clients => {
                clients.forEach(client => client.postMessage(result.result));
            })
        };
    }
})