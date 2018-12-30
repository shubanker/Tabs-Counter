function tabCount(onTabCountUpdate,preventInitialFire){
    /**
     * @updateInterval: interval in milli seconds to count/update active tabs status.
     * minimum value: 1000
     */
    var updateInterval = 2000;
    /**
     * @TabId: unique id for this tab.
     */
    var tabId = Math.random().toString(36).substring(7);
    preventInitialFire = preventInitialFire===undefined?false:preventInitialFire;
    var self = this;
    var tabsCount = 0;
    var updateActive = function(){
        var data = getData(),
        now = Date.now();
        data.list[tabId]=now;
        if(undefined===data.lastCleaned || Number(data.lastCleaned) + 20000 < now){
            data = clearList(data);
        }
        updateData(data);
        if(self.onTabCountUpdate!==undefined || tabsCount===0){
            self.tabsCount(false);
        }
    }
    self.tabsCount = function(skipCallback){
        skipCallback = skipCallback===undefined?true:skipCallback;
        var data=getData();
        var listIds=Object.keys(data.list);
        var now=Date.now();
        var count = 0;
        listIds.forEach(function(id) {
            if(data.list[id]+updateInterval*1.2>now){
                count++;
            }
        });
        if(!skipCallback && tabsCount !== count){
            if(self.onTabCountUpdate !==undefined){
                onTabCountUpdate(count);
            }       
        }
        return tabsCount = count;
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
    var updateData = function(data){
        localStorage.setItem('tabCountData',typeof(data)==="string"?data:JSON.stringify(data));
    }
    var getData = function(){
        savedData = localStorage.getItem('tabCountData');
        return savedData== null ?{list:{}}:JSON.parse(savedData);
    }
    var updateActiveInterval = setInterval(function(){
        updateActive();
    }, updateInterval);
    
    /**
     * Initialise 
     */
    updateActive();
    this.onTabCountUpdate = onTabCountUpdate;
    if(!preventInitialFire && undefined !== this.onTabCountUpdate){
        this.onTabCountUpdate(tabsCount);
    }
    window.onbeforeunload=function(e){
        var data = getData();
        delete data.list[tabId];
        updateData(data);
    }
    return {
        tabsCount:self.tabsCount
    };
}