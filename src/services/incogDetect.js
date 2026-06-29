//snagged from https://stackoverflow.com/questions/52759238/private-incognito-mode-detection-for-ios-12-safari

function retry(isDone, next, maxRetry, intervalMs) {
    var currentTrial = 0;
    var maxRetryCount = typeof maxRetry === 'number' ? maxRetry : 50;
    var interval = typeof intervalMs === 'number' ? intervalMs : 10;
    var finished = false;

    function finish(isTimeout) {
        if (finished) {
            return;
        }
        finished = true;
        window.clearInterval(id);
        next(isTimeout);
    }

    var id = window.setInterval(
        function() {
            if (isDone()) {
                finish(false);
                return;
            }
            if (++currentTrial > maxRetryCount) {
                finish(true);
            }
        },
        interval
    );
}

function isIE10OrLater(user_agent) {
    var ua = user_agent.toLowerCase();
    if (ua.indexOf('msie') === 0 && ua.indexOf('trident') === 0) {
        return false;
    }
    var match = /(?:msie|rv:)\s?([\d\.]+)/.exec(ua);
    if (match && parseInt(match[1], 10) >= 10) {
        return true;
    }
    // MS Edge Detection from this gist: https://gist.github.com/cou929/7973956
    var edge = /edge/.exec(ua);
    if (edge && edge[0] == "edge") {
        return true;
    }
    return false;
}

module.exports = function(callback) {
    var is_private;

    if (window.webkitRequestFileSystem) {
        window.webkitRequestFileSystem(
            window.TEMPORARY, 1,
            function() {
                is_private = false;
            },
            function(e) {
                console.log(e);
                is_private = true;
            }
        );
    } else if (window.indexedDB && /Firefox/.test(window.navigator.userAgent)) {
        var db;
        try {
            db = window.indexedDB.open('test');
        } catch(e) {
            is_private = true;
        }

        if (typeof is_private === 'undefined' && db) {
            db.onerror = function() {
                is_private = true;
            };
            db.onsuccess = function() {
                is_private = false;
            };
            db.onblocked = function() {
                is_private = false;
            };
        }
    } else if (isIE10OrLater(window.navigator.userAgent)) {
        is_private = false;
        try {
            if (!window.indexedDB) {
                is_private = true;
            }
        } catch (e) {
            is_private = true;
        }
    } else if (window.localStorage && /Safari/.test(window.navigator.userAgent)) {

        // One-off check for weird sports 2.0 polyfill
        // This also impacts iOS Firefox and Chrome (newer versions), apparently
        // @see bglobe-js/containers/App.js:116
        if (window.safariIncognito) {
            is_private = true;
        } else {
            try {
                window.openDatabase(null, null, null, null);
            } catch (e) {
                is_private = true;
            }
            try {
                window.localStorage.setItem('test', 1);
            } catch(e) {
                is_private = true;
            }
        }

        if (typeof is_private === 'undefined') {
            is_private = false;
            window.localStorage.removeItem('test');
        }
    }

    retry(
        function isDone() {
            return typeof is_private !== 'undefined';
        },
        function next(is_timeout) {
            // Default to normal browsing when detection is inconclusive.
            callback(is_private === true);
        }
    );
}
