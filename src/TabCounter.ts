class TabCount{

    /**
     * @updateInterval: interval in milli seconds to count/update active tabs status.
     * minimum value: 1000
     */
    updateInterval:number = 2000;
    /**
     * @TabId: unique id for this tab.
     */
    tabId:string = Math.random().toString(36).substring(7);
    tabsCounter:number = 0;
    onTabCountUpdate = [];
    updateActiveInterval=0;

    constructor(){            
        /**
         * Initialise 
         */
        this.updateActive();
        this.start();
        
        window.onbeforeunload=e=>{
            let data = this.getData();
            delete data.list[this.tabId];
            this.updateData(data);
        }
    }
    tabsCount = (skipCallback:boolean=true) => {
        let data = this.getData();
        let listIds = Object.keys(data.list);
        let now = Date.now();
        let count = 0;
        listIds.forEach(id => {
            if(data.list[id] + this.updateInterval *1.2 > now){
                count++;
            }
        });
        if(!skipCallback && this.tabsCounter !== count){
            this.onTabCountUpdate.forEach(event => {
                event(count);
            });
        }
        return this.tabsCounter = count;
    }
    updateActive = ()=> {
        var data = this.getData(),
        now = Date.now();
        data.list[this.tabId]=now;
        if(undefined === data.lastCleaned || +data.lastCleaned + 20000 < now){
            data = this.clearList(data);
        }
        this.updateData(data);
        this.tabsCount(false);
    }
    /**
     * Cleans data of closed tabs
     */
    clearList = (data:{list:object,lastCleaned:number})=>{
        var listIds=Object.keys(data.list);
        var now=Date.now();
        listIds.forEach((id)=> {
            if(data.list[id] + Math.max(8000,this.updateInterval * 1.5) < now){//If tab last update is older get rid of it.
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
    onTabChange = (callback:Function,executeNow:boolean=false)=>{
        if(typeof callback==="function"){
            this.onTabCountUpdate.push(callback);
            if(executeNow){
                callback(this.tabsCount());
            }
        }
    }
    updateData = function(data:any):void{
        localStorage.setItem('tabCountData',typeof(data)==="string"?data:JSON.stringify(data));
    }
    getData = ():{list:object,lastCleaned:number}=>{
        let savedData = localStorage.getItem('tabCountData');
        return savedData == null ? {list:{},lastCleaned:0} : JSON.parse(savedData);
    }
    setUpdateInterval = (interval:number=this.updateInterval)=>{
        if(null !== this.updateActiveInterval){
            this.pause();
        }
        this.start(interval);
    }
    pause = ()=>{
        clearInterval(this.updateActiveInterval);
        this.updateActiveInterval = 0;
    }
    start(interval:number=this.updateInterval){
        this.updateActiveInterval = setInterval(()=>{
            this.updateActive();
        }, this.updateInterval = interval);
    }
}
const tabCount = new TabCount();