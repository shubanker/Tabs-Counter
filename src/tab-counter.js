var tabCount = (function(){
    /**
     * @updateInterval: interval in milli seconds to count/update active tabs status.
     * minimum value: 1000
     */
    var updateInterval = 2000;
    /**
     * @TabId: unique id for this tab.
     */
    var tabId = Math.random().toString(36).substring(7);
    var self = this;
    var tabsCounter = 0;
    this.onTabCountUpdate = [];
    var updateActive = function(){
        var data = getData(),
        now = Date.now();
        data.list[tabId]=now;
        if(undefined===data.lastCleaned || Number(data.lastCleaned) + 20000 < now){
            data = clearList(data);
        }
        updateData(data);
        tabsCount(false);
    }
    var tabsCount = function(skipCallback){
        skipCallback = skipCallback === undefined ? true : skipCallback;
        var data=getData();
        var listIds=Object.keys(data.list);
        var now=Date.now();
        var count = 0;
        listIds.forEach(function(id) {
            if(data.list[id]+updateInterval*1.2>now){
                count++;
            }
        });
        if(!skipCallback && tabsCounter !== count){
            onTabCountUpdate.forEach(function(event) {
                event(count);
            });
        }
        return tabsCounter = count;
    }
    /**
     * Cleans data of closed tabs
     */
    var clearList = function(data){
        var listIds=Object.keys(data.list);
        var now=Date.now();
        listIds.forEach(function(id) {
            if(data.list[id]+Math.max(8000,updateInterval*1.5)<now){//If tab last update is older get rid of it.
                delete data.list[id];
            }
        });
        data.lastCleaned=now;
        return data;
        
    }
    /**
     * 
     * @param {function} callback 
     * @param {boolean} executeNow => optional, to execute the callback immediatly with current tab count.
     */
    var onTabChange = function(callback,executeNow){
        executeNow = executeNow === undefined ? false : executeNow;
        if(typeof callback==="function"){
            onTabCountUpdate.push(callback);
            if(executeNow){
                callback(tabsCount());
            }
        }
    }
    var updateData = function(data){
        localStorage.setItem('tabCountData',typeof(data)==="string"?data:JSON.stringify(data));
    }
    var getData = function(){
        savedData = localStorage.getItem('tabCountData');
        return savedData== null ?{list:{}}:JSON.parse(savedData);
    }
    var updateActiveInterval;
    var setUpdateInterval = function(interval){
        interval = interval === undefined || isNaN(interval) ||  interval<1000 ? updateInterval:interval;
        if(undefined !== updateActiveInterval){
            clearInterval(updateActiveInterval);
        }
        updateActiveInterval = setInterval(function(){
            updateActive();
        }, updateInterval = interval);
    }
    
    /**
     * Initialise 
     */
    updateActive();
    setUpdateInterval();
    window.onbeforeunload=function(e){
        var data = getData();
        delete data.list[tabId];
        updateData(data);
    }
    return {
        tabsCount:tabsCount,
        onTabChange:onTabChange,
        setUpdateInterval:setUpdateInterval
    };
})();