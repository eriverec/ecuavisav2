var PageContext = function () {
    this.namespace = "com.kma.springstreams";
};

PageContext.prototype.cid = "";
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

generateCID = function () {
    var d = new Date().getTime();
    var did = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    // old generation method 
    // var did = 'vmpc' + Math.ceil((new Date()).getTime() / 1000).toString(16) + (0x8000 | Math.random() * 0xffff).toString(16);
    did = CryptoJS.MD5(did);
    PageContext.prototype.cid = did.toString().substring(0, 16);

}

sendMessageToReceiver = function () {
    if (PageContext.prototype.cid == "")
        generateCID();
    var session = cast.framework.CastContext.getInstance().getCurrentSession();
    session.sendMessage("urn:x-cast:com.de.spring.jschromecast", {
        "id": PageContext.prototype.cid
    },
        function (data) {
            console.log("success" + data);
        },
        function (error) {
            console.error("Cannot communicate with receiver" + error);
        }
    );
}

PageContext.prototype.isCasting = function () {
    console.log("coming here");
    if (cast && cast.framework) {
        var context = cast.framework.CastContext.getInstance();
        context.addEventListener(
            cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
            function (event) {
                switch (event.sessionState) {
                    case cast.framework.SessionState.SESSION_STARTED:
                        sendMessageToReceiver();
                        break;
                    case cast.framework.SessionState.SESSION_RESUMED:
                        sendMessageToReceiver();
                        break;
                    case cast.framework.SessionState.SESSION_ENDED:
                        console.log('CastContext: CastSession disconnected');
                        // Update locally as necessary
                        break;
                }
            });
    }
    return false;
}
/*
 CryptoJS v3.1.2
 code.google.com/p/crypto-js
 (c) 2009-2013 by Jeff Mott. All rights reserved.
 code.google.com/p/crypto-js/wiki/License
 */
var CryptoJS = CryptoJS || function (t, n) { var i = {}, r = i.lib = {}, e = function () { }, s = r.Base = { extend: function (t) { e.prototype = this; var n = new e; return t && n.mixIn(t), n.hasOwnProperty("init") || (n.init = function () { n.$super.init.apply(this, arguments) }), n.init.prototype = n, n.$super = this, n }, create: function () { var t = this.extend(); return t.init.apply(t, arguments), t }, init: function () { }, mixIn: function (t) { for (var n in t) t.hasOwnProperty(n) && (this[n] = t[n]); t.hasOwnProperty("toString") && (this.toString = t.toString) }, clone: function () { return this.init.prototype.extend(this) } }, o = r.WordArray = s.extend({ init: function (t, n) { t = this.words = t || [], this.sigBytes = void 0 != n ? n : 4 * t.length }, toString: function (t) { return (t || c).stringify(this) }, concat: function (t) { var n = this.words, i = t.words, r = this.sigBytes; if (t = t.sigBytes, this.clamp(), r % 4) for (var e = 0; e < t; e++)n[r + e >>> 2] |= (i[e >>> 2] >>> 24 - e % 4 * 8 & 255) << 24 - (r + e) % 4 * 8; else if (65535 < i.length) for (e = 0; e < t; e += 4)n[r + e >>> 2] = i[e >>> 2]; else n.push.apply(n, i); return this.sigBytes += t, this }, clamp: function () { var n = this.words, i = this.sigBytes; n[i >>> 2] &= 4294967295 << 32 - i % 4 * 8, n.length = t.ceil(i / 4) }, clone: function () { var t = s.clone.call(this); return t.words = this.words.slice(0), t }, random: function (n) { for (var i = [], r = 0; r < n; r += 4)i.push(4294967296 * t.random() | 0); return new o.init(i, n) } }), a = i.enc = {}, c = a.Hex = { stringify: function (t) { var n = t.words; t = t.sigBytes; for (var i = [], r = 0; r < t; r++) { var e = n[r >>> 2] >>> 24 - r % 4 * 8 & 255; i.push((e >>> 4).toString(16)), i.push((15 & e).toString(16)) } return i.join("") }, parse: function (t) { for (var n = t.length, i = [], r = 0; r < n; r += 2)i[r >>> 3] |= parseInt(t.substr(r, 2), 16) << 24 - r % 8 * 4; return new o.init(i, n / 2) } }, u = a.Latin1 = { stringify: function (t) { var n = t.words; t = t.sigBytes; for (var i = [], r = 0; r < t; r++)i.push(String.fromCharCode(n[r >>> 2] >>> 24 - r % 4 * 8 & 255)); return i.join("") }, parse: function (t) { for (var n = t.length, i = [], r = 0; r < n; r++)i[r >>> 2] |= (255 & t.charCodeAt(r)) << 24 - r % 4 * 8; return new o.init(i, n) } }, h = a.Utf8 = { stringify: function (t) { try { return decodeURIComponent(escape(u.stringify(t))) } catch (t) { throw Error("Malformed UTF-8 data") } }, parse: function (t) { return u.parse(unescape(encodeURIComponent(t))) } }, f = r.BufferedBlockAlgorithm = s.extend({ reset: function () { this._data = new o.init, this._nDataBytes = 0 }, _append: function (t) { "string" == typeof t && (t = h.parse(t)), this._data.concat(t), this._nDataBytes += t.sigBytes }, _process: function (n) { var i = this._data, r = i.words, e = i.sigBytes, s = this.blockSize, a = e / (4 * s); if (n = (a = n ? t.ceil(a) : t.max((0 | a) - this._minBufferSize, 0)) * s, e = t.min(4 * n, e), n) { for (var c = 0; c < n; c += s)this._doProcessBlock(r, c); c = r.splice(0, n), i.sigBytes -= e } return new o.init(c, e) }, clone: function () { var t = s.clone.call(this); return t._data = this._data.clone(), t }, _minBufferSize: 0 }); r.Hasher = f.extend({ cfg: s.extend(), init: function (t) { this.cfg = this.cfg.extend(t), this.reset() }, reset: function () { f.reset.call(this), this._doReset() }, update: function (t) { return this._append(t), this._process(), this }, finalize: function (t) { return t && this._append(t), this._doFinalize() }, blockSize: 16, _createHelper: function (t) { return function (n, i) { return new t.init(i).finalize(n) } }, _createHmacHelper: function (t) { return function (n, i) { return new l.HMAC.init(t, i).finalize(n) } } }); var l = i.algo = {}; return i }(Math); !function (t) { function n(t, n, i, r, e, s, o) { return ((t = t + (n & i | ~n & r) + e + o) << s | t >>> 32 - s) + n } function i(t, n, i, r, e, s, o) { return ((t = t + (n & r | i & ~r) + e + o) << s | t >>> 32 - s) + n } function r(t, n, i, r, e, s, o) { return ((t = t + (n ^ i ^ r) + e + o) << s | t >>> 32 - s) + n } function e(t, n, i, r, e, s, o) { return ((t = t + (i ^ (n | ~r)) + e + o) << s | t >>> 32 - s) + n } for (var s = CryptoJS, o = (c = s.lib).WordArray, a = c.Hasher, c = s.algo, u = [], h = 0; 64 > h; h++)u[h] = 4294967296 * t.abs(t.sin(h + 1)) | 0; c = c.MD5 = a.extend({ _doReset: function () { this._hash = new o.init([1732584193, 4023233417, 2562383102, 271733878]) }, _doProcessBlock: function (t, s) { for (var o = 0; 16 > o; o++) { var a = t[f = s + o]; t[f] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8) } o = this._hash.words; var c, h, f = t[s + 0], l = (a = t[s + 1], t[s + 2]), p = t[s + 3], d = t[s + 4], g = t[s + 5], y = t[s + 6], _ = t[s + 7], v = t[s + 8], w = t[s + 9], B = t[s + 10], m = t[s + 11], S = t[s + 12], x = t[s + 13], H = t[s + 14], z = t[s + 15], C = o[0], M = e(M = e(M = e(M = e(M = r(M = r(M = r(M = r(M = i(M = i(M = i(M = i(M = n(M = n(M = n(M = n(M = o[1], h = n(h = o[2], c = n(c = o[3], C = n(C, M, h, c, f, 7, u[0]), M, h, a, 12, u[1]), C, M, l, 17, u[2]), c, C, p, 22, u[3]), h = n(h, c = n(c, C = n(C, M, h, c, d, 7, u[4]), M, h, g, 12, u[5]), C, M, y, 17, u[6]), c, C, _, 22, u[7]), h = n(h, c = n(c, C = n(C, M, h, c, v, 7, u[8]), M, h, w, 12, u[9]), C, M, B, 17, u[10]), c, C, m, 22, u[11]), h = n(h, c = n(c, C = n(C, M, h, c, S, 7, u[12]), M, h, x, 12, u[13]), C, M, H, 17, u[14]), c, C, z, 22, u[15]), h = i(h, c = i(c, C = i(C, M, h, c, a, 5, u[16]), M, h, y, 9, u[17]), C, M, m, 14, u[18]), c, C, f, 20, u[19]), h = i(h, c = i(c, C = i(C, M, h, c, g, 5, u[20]), M, h, B, 9, u[21]), C, M, z, 14, u[22]), c, C, d, 20, u[23]), h = i(h, c = i(c, C = i(C, M, h, c, w, 5, u[24]), M, h, H, 9, u[25]), C, M, p, 14, u[26]), c, C, v, 20, u[27]), h = i(h, c = i(c, C = i(C, M, h, c, x, 5, u[28]), M, h, l, 9, u[29]), C, M, _, 14, u[30]), c, C, S, 20, u[31]), h = r(h, c = r(c, C = r(C, M, h, c, g, 4, u[32]), M, h, v, 11, u[33]), C, M, m, 16, u[34]), c, C, H, 23, u[35]), h = r(h, c = r(c, C = r(C, M, h, c, a, 4, u[36]), M, h, d, 11, u[37]), C, M, _, 16, u[38]), c, C, B, 23, u[39]), h = r(h, c = r(c, C = r(C, M, h, c, x, 4, u[40]), M, h, f, 11, u[41]), C, M, p, 16, u[42]), c, C, y, 23, u[43]), h = r(h, c = r(c, C = r(C, M, h, c, w, 4, u[44]), M, h, S, 11, u[45]), C, M, z, 16, u[46]), c, C, l, 23, u[47]), h = e(h, c = e(c, C = e(C, M, h, c, f, 6, u[48]), M, h, _, 10, u[49]), C, M, H, 15, u[50]), c, C, g, 21, u[51]), h = e(h, c = e(c, C = e(C, M, h, c, S, 6, u[52]), M, h, p, 10, u[53]), C, M, B, 15, u[54]), c, C, a, 21, u[55]), h = e(h, c = e(c, C = e(C, M, h, c, v, 6, u[56]), M, h, z, 10, u[57]), C, M, y, 15, u[58]), c, C, x, 21, u[59]), h = e(h, c = e(c, C = e(C, M, h, c, d, 6, u[60]), M, h, m, 10, u[61]), C, M, l, 15, u[62]), c, C, w, 21, u[63]); o[0] = o[0] + C | 0, o[1] = o[1] + M | 0, o[2] = o[2] + h | 0, o[3] = o[3] + c | 0 }, _doFinalize: function () { var n = this._data, i = n.words, r = 8 * this._nDataBytes, e = 8 * n.sigBytes; i[e >>> 5] |= 128 << 24 - e % 32; var s = t.floor(r / 4294967296); for (i[15 + (e + 64 >>> 9 << 4)] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8), i[14 + (e + 64 >>> 9 << 4)] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8), n.sigBytes = 4 * (i.length + 1), this._process(), i = (n = this._hash).words, r = 0; 4 > r; r++)e = i[r], i[r] = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8); return n }, clone: function () { var t = a.clone.call(this); return t._hash = this._hash.clone(), t } }), s.MD5 = a._createHelper(c), s.HmacMD5 = a._createHmacHelper(c) }(Math);
