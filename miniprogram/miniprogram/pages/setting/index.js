//index.js
const App = getApp();
Page({
    data             : {
        userInfo: {},
        checked : {
            report       : false,
            syncWeixinPay: false
        }
    },
    onLoad           : function (options) {
        // 页面创建时执行
        //console.log(options)
    },
    onShow           : function () {
        // 页面出现在前台时执行
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                active: 2
            })
        }
    },
    onReady          : function () {
        // 页面首次渲染完毕时执行
    },
    onHide           : function () {
        // 页面从前台变为后台时执行
    },
    onUnload         : function () {
        // 页面销毁时执行
    },
    onPullDownRefresh: function () {
        // 触发下拉刷新时执行
    },
    onReachBottom    : function () {
        // 页面触底时执行
    },
    onShareAppMessage: function () {
        // 页面被用户分享时执行
    },
    onPageScroll     : function () {
        // 页面滚动时执行
    },
    onResize         : function () {
        // 页面尺寸变化时执行
    },
    getUserInfo(e) {
        console.log(e.detail.userInfo)
        this.setData({
            userInfo: e.detail.userInfo
        })
    },
    onChange(e) {
        let {name} = e.target.dataset;

        if (name === 'report') {
            wx.requestSubscribeMessage({
                tmplIds: ['Gi046eRQRFcopL7Sa-P450rL9PD7rtv4KlPdBYIrBmM'],
                success(res) {
                    wx.getSetting({
                        withSubscriptions:true,
                        success:function(res){
                            console.log(res)
                        }
                    })
                    return false;
                    if (res['Gi046eRQRFcopL7Sa-P450rL9PD7rtv4KlPdBYIrBmM'] === 'accept') {
                        //this.setData({["checked." + name]: e.detail});

                        wx.cloud.callFunction({
                            name: 'openapi',
                            data:{
                                'action':'sendSubscribeMessage',
                                'templateId':'Gi046eRQRFcopL7Sa-P450rL9PD7rtv4KlPdBYIrBmM'
                            },
                            complete: res => {
                                console.log('callFunction test result: ', res)
                            }
                        })
                    }
                }
            })
        } else {
            this.setData({["checked." + name]: e.detail});
        }

    }
})
