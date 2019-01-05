# Tab Counter

Track the number of Tabs a user has currently opened of your website.

## Getting Started

Include [tab-counter.js](src/tab-counter.js) in your page.
```javascript
console.log(tabCount.tabsCount());
```
you can also set tabCount change events by passing callback function to `tabCount.onTabChange` which will be triggered each time number of tab changes, check out this [example](demo/count.html), you can also see it working [here](https://htmlpreview.github.io/?https://github.com/shubanker/Tabs-Counter/blob/master/demo/count.html), `tabCount.onTabChange` also has a second optional parameter which accepts a boolean value to execute callBack immediatly, default is set to `false`. 

##### Configuration:

Tabcounter runs a *TimeInterval* internally to track change in number of tabs, default interval is set to **2000ms** (2 seconds) which can configured by function `tabCount.updateActiveInterval`.

##### Limitations:

Browses tend to throttle *TimeIntervals* of inactive tabs especially if timer is less than *1000ms(1s)*, thus the counter may fail to give precious count, workaround on this is WebWorkers, for more precious count include a  WebWorker library such as [this](https://github.com/myonov/momentum) before loading Tab counter.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.