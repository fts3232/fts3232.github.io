//缓存名称
var cacheName = 'PWA Demo-v1';
//要缓存的文件
/*var cacheFile = [
    'css/style.css',
    'js/app.js'
];*/
//安装
self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
    /*e.waitUntil(
        //添加缓存
        caches.open(cacheName).then(function(cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(cacheFile);
        })
    );*/
});

function returnResponse(event){
    var url = new URL(event.request.url);
    var index = url.pathname.lastIndexOf(".");
    var filename = url.pathname.substr(index+1);
    //判断后缀是否静态文件和get请求
    if(event.request.method === 'GET' && ['css','js','ico','png','jpg','gif'].indexOf(filename) !== -1){
        //打开缓存
        return caches.open(cacheName).then(function(cache) {
            //判断是否有缓存
            return cache.match(event.request).then(function(res) {
                //判断是否有相同url的cache
                cache.match(event.request,{ignoreSearch:true}).then(function(res){
                    if(res && res.url !== event.request.url){
                        cache.delete(res.url);
                        console.log('[Service Worker] Delete Cache: '+res.url);
                    }
                });
                console.log('[Service Worker] Fetching resource: '+event.request.url);
                //缓存存在返回缓存，不存在发送请求，然后再把数据缓存下来
                return res || fetch(event.request).then(function(response) {
                    console.log('[Service Worker] Caching new resource: '+event.request.url);
                    cache.put(event.request, response.clone());
                    return  response;
                });
            });
        })
    } else {
        return fetch(event.request)
    }
}

//响应请求
self.addEventListener('fetch', function(event) {
    //响应控制
    event.respondWith(
        returnResponse(event)
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
