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
        var data = getData();
        data.list[tabId]=Date.now();
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
    var clearList = function(){
        var data=getData();
        var listIds=Object.keys(data.list);
        var now=Date.now();
        listIds.forEach(function(id) {
            if(data.list[id]+8000<now){//If tab last update is 8 seconds or older get rid of it.
                delete data.list[id];
            }
        });
        updateData(data);
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
    var clearListInterval = setInterval(function(){
        clearList();
    }, 20000);
    
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