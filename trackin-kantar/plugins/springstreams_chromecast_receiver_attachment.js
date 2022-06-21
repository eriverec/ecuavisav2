var PageContext = function () {
    this.namespace = "com.kma.springstreams";
};

PageContext.prototype.id = "";
const context1 = cast.framework.CastReceiverContext.getInstance();

const CUSTOM_CHANNEL = "urn:x-cast:com.de.spring.jschromecast";
context1.addCustomMessageListener(CUSTOM_CHANNEL, function (customEvent) {
    // handle customEvent.

    PageContext.prototype.id = customEvent.data.id;
    context1.sendCustomMessage(CUSTOM_CHANNEL, undefined, "Received");
});
// preload an image, implement it with the specific SDK API
PageContext.prototype.preloadImage = function (s) {
    new Image().src = s;
    // put your implementation here, preload the image s, or send s as a http/https request
};

// Local Storage getItem function, the library manages a file on local storage, please make sure the application owns the right to read files.
PageContext.prototype.getLocalStorageItem = function (key) {
    // put your implementation here, return the local storage item as a string
    return localStorage.getItem(key);
};

// Local Storage setItem function, the library manages a file on local storage, please make sure the application owns the right to write files.
PageContext.prototype.setLocalStorageItem = function (key, value) {
    // put your implementation here, store key/value in the local storage
    localStorage.setItem(key, value);
};

// Get the current site url, implement it with the specific SDK API
PageContext.prototype.getWindowLocationURL = function () {
    // put your implementation here, return the current site url
};

PageContext.prototype.getChromecastID = function () {
    return PageContext.prototype.id;
};