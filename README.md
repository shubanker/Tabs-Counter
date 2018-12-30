# Tab Counter

Track the number of Tabs a user has currently opened of your website.

## Getting Started

Include [tab-counter.js](src/tab-counter.js) in your page.
```javascript
console.log(tabCount.tabsCount());
```
you can also set a tabCount change event by passing a callback function to `tabCount.onTabChange` which will be triggered each time number of tab changes for a working example check out this [demo](demo/count.html).
##### Configuration:
Tabcounter internally runs a *TimeInterval* internally to track opened number of tabs, default interval is set to **2000ms** (2 seconds) which can be modified by updating value of variable `updateInterval`.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details