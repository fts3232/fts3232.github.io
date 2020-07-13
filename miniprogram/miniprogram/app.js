//app.js
App({
    //生命周期回调——监听小程序初始化
    onLaunch() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                // env: 'my-env-id',
                traceUser: true,
            })
        }
    },
    globalData: {
        "list"  : {
            "home": {
                path: "/pages/index/index",
                icon: "home-o",
                text: "首页"
            },
            "add" : {
                path: "/pages/add/index",
                icon: "add",
                text: "添加"
            }
        }
    },
    //生命周期回调——监听小程序启动或切前台
    onShow() {
        console.log('show')
    },
    //生命周期回调——监听小程序切后台
    onHide() {
        console.log('hide')
    },
    //错误监听函数
    onError(msg) {
        console.log(msg)
    },
    //页面不存在监听函数
    onPageNotFound(res) {
        console.log('页面不存在')
    }
})
