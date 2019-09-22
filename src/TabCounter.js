var TabCount = /** @class */ (function () {
    function TabCount() {
        var _this = this;
        /**
         * @updateInterval: interval in milli seconds to count/update active tabs status.
         * minimum value: 1000
         */
        this.updateInterval = 2000;
        /**
         * @TabId: unique id for this tab.
         */
        this.tabId = Math.random().toString(36).substring(7);
        this.tabsCounter = 0;
        this.onTabCountUpdate = [];
        this.updateActiveInterval = 0;
        this.tabsCount = function (skipCallback) {
            if (skipCallback === void 0) { skipCallback = true; }
            var data = _this.getData();
            var listIds = Object.keys(data.list);
            var now = Date.now();
            var count = 0;
            listIds.forEach(function (id) {
                if (data.list[id] + _this.updateInterval * 1.2 > now) {
                    count++;
                }
            });
            if (!skipCallback && _this.tabsCounter !== count) {
                _this.onTabCountUpdate.forEach(function (event) {
                    event(count);
                });
            }
            return _this.tabsCounter = count;
        };
        this.updateActive = function () {
            var data = _this.getData(), now = Date.now();
            data.list[_this.tabId] = now;
            if (undefined === data.lastCleaned || +data.lastCleaned + 20000 < now) {
                data = _this.clearList(data);
            }
            _this.updateData(data);
            _this.tabsCount(false);
        };
        /**
         * Cleans data of closed tabs
         */
        this.clearList = function (data) {
            var listIds = Object.keys(data.list);
            var now = Date.now();
            listIds.forEach(function (id) {
                if (data.list[id] + Math.max(8000, _this.updateInterval * 1.5) < now) { //If tab last update is older get rid of it.
                    delete data.list[id];
                }
            });
            data.lastCleaned = now;
            return data;
        };
        /**
         *
         * @param {function} callback
         * @param {boolean} executeNow => optional, to execute the callback immediatly with current tab count.
         */
        this.onTabChange = function (callback, executeNow) {
            if (executeNow === void 0) { executeNow = false; }
            if (typeof callback === "function") {
                _this.onTabCountUpdate.push(callback);
                if (executeNow) {
                    callback(_this.tabsCount());
                }
            }
        };
        this.updateData = function (data) {
            localStorage.setItem('tabCountData', typeof (data) === "string" ? data : JSON.stringify(data));
        };
        this.getData = function () {
            var savedData = localStorage.getItem('tabCountData');
            return savedData == null ? { list: {}, lastCleaned: 0 } : JSON.parse(savedData);
        };
        this.setUpdateInterval = function (interval) {
            if (interval === void 0) { interval = _this.updateInterval; }
            if (null !== _this.updateActiveInterval) {
                _this.pause();
            }
            _this.start(interval);
        };
        this.pause = function () {
            clearInterval(_this.updateActiveInterval);
            _this.updateActiveInterval = 0;
        };
        /**
         * Initialise
         */
        this.updateActive();
        this.start();
        window.onbeforeunload = function (e) {
            var data = _this.getData();
            delete data.list[_this.tabId];
            _this.updateData(data);
        };
    }
    TabCount.prototype.start = function (interval) {
        var _this = this;
        if (interval === void 0) { interval = this.updateInterval; }
        this.updateActiveInterval = setInterval(function () {
            _this.updateActive();
        }, this.updateInterval = interval);
    };
    return TabCount;
}());
var tabCount = new TabCount();
