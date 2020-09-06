//index.js
const App = getApp();
Page({
    data             : {
        formData: {

        }
    },
    onLoad           : function (options) {
        // 页面创建时执行
        //console.log(options)
        //console.log(App.globalData.select)
        this.setData({formData:App.globalData.select})
    },
    onShow           : function () {
        // 页面出现在前台时执行

    },
    onReady          : function () {
        // 页面首次渲染完毕时执行
        /*this.setData({
            formData: {
                date    : new Date().format('yyyy-MM-dd'),
                amount  : 123,
                remark  : 123,
                category: [0, 0],
            }
        });*/
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
})
