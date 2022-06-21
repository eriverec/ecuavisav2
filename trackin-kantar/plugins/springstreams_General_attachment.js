var PageContext = function() {
    this.namespace = "com.kma.springstreams";
};

// preload an image, implement it with the specific SDK API
PageContext.prototype.preloadImage = function(s) {
    // put your implementation here, preload the image s, or send s as a http/https request
}

// Local Storage getItem function, the library manages a file on local storage, please make sure the application owns the right to read files.
PageContext.prototype.getLocalStorageItem = function(key) {
    // put your implementation here, return the local storage item as a string
}

// Local Storage setItem function, the library manages a file on local storage, please make sure the application owns the right to write files.
PageContext.prototype.setLocalStorageItem = function(key, value) {
    // put your implementation here, store key/value in the local storage
}

// Get the current site url, implement it with the specific SDK API
PageContext.prototype.getWindowLocationURL = function() {
    // put your implementation here, return the current site url
}
