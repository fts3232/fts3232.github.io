Component({
    properties: {},
    data      : {
        "active": "home",
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

    methods: {
        onChange(event) {
            wx.switchTab({
                url     : this.data.list[event.detail]['path'],
                success : function (res) {
                    //_this.setData({'active':event.detail})
                },
                fail    : function (res) {

                },
                complete: function (res) {

                },
            })
            this.setData({'active':event.detail})
        }
    },
    ready() {
        console.log('ready')
    }
});
