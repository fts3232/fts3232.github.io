//缓存名称
var cacheName = 'PWA Demo-v1';
//要缓存的文件
var cacheFile = [
    'css/style.css',
    'js/app.js'
];
//安装
self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        //添加缓存
        caches.open(cacheName).then(function(cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(cacheFile);
        })
    );
});

//响应请求
self.addEventListener('fetch', function(e) {
    //响应控制
    e.respondWith(
        //判断是否有缓存
        caches.match(e.request).then(function(res) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            //缓存存在返回缓存，不存在发送请求，然后再把数据缓存下来
            return res || fetch(e.request).then(function(response) {
                return caches.open(cacheName).then(function(cache) {
                    console.log('[Service Worker] Caching new resource: '+e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});

//当Service Worker被触发时触发该事件
self.addEventListener('activate', function(e) {
    e.waitUntil(
        //获取所有缓存列表
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if(cacheName.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});