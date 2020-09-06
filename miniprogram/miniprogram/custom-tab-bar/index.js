const App = getApp();
Component({
    options   : {
        styleIsolation: 'shared',
    },
    properties: {},
    data      : {
        active: 0,
        list  : [
            {
                "text"      : "明细",
                "path"      : "/pages/index/index",
                "icon"      : "balance-list-o",
                'iconActive': 'balance-list',
            },
            {
                "text"      : "统计",
                "path"      : "/pages/statistics/index",
                "icon"      : "clock-o",
                'iconActive': 'clock',
            },
            {
                "text"      : "设置",
                "path"      : "/pages/setting/index",
                "icon"      : "setting-o",
                'iconActive': 'setting',
            }
        ]
    },

    methods  : {
        switchTab(event) {
            wx.switchTab({
                url     : this.data.list[event.detail].path,
                success : function (res) {
                    //_this.setData({'active':event.detail})
                },
                fail    : function (res) {

                },
                complete: function (res) {
                },
            })
            this.setData({active: event.detail})
        }
    },
    lifetimes: {
        created() {
        },

        attached() {
            // 在组件实例进入页面节点树时执行
        },
        ready() {

        },
        detached() {
            // 在组件实例被从页面节点树移除时执行
        },
    }
});
