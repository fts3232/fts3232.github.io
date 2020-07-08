Notification.requestPermission().then(function (result) {
    if (result === 'granted') {
        var options = {
            body: '通知内容',
        };
        new Notification('通知', options);
    }
});

//注册service worker
if ('serviceWorker' in navigator) {
    //service worker放在域根目录下，代表这个将会获取到这个域下的所有 fetch 事件，如果放在/js/sw.js下，只能获取到js目录下的事件
    navigator.serviceWorker.register('./sw.js');
}