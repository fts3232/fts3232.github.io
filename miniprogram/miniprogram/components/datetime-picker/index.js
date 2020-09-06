Component({
    options   : {
        virtualHost: true
    },
    properties: {
        'type' : {
            type: String,
        },
        'show' : {
            type : Boolean,
            value: false
        },
        'title': {
            type : String,
            value: '请选择年月日'
        },
        'value' : {
            type : Number,
            value: new Date().getTime()
        }
    },

    data         : {
        formatter(type, value) {
            if (type === 'year') {
                return value + '年';
            } else if (type === 'month') {
                return value + '月';
            } else if (type === 'day') {
                return value + '日';
            }
            return value;
        }
    },
    lifetimes    : {
        created() {
            //在组件实例刚刚被创建时执行
        },
        attached() {
            // 在组件实例进入页面节点树时执行
        },
        ready() {
            //在组件在视图层布局完成后执行
        },
        moved() {
            //在组件实例被移动到节点树另一个位置时执行
        },
        detached() {
            // 在组件实例被从页面节点树移除时执行
        },
        error() {
            //每当组件方法抛出错误时执行
        }
    },
    pageLifetimes: {
        show  : function () {
            // 页面被展示
        },
        hide  : function () {
            // 页面被隐藏
        },
        resize: function (size) {
            // 页面尺寸变化
        }
    },

    methods: {
        onClose(e) {
            this.setData({show: false});
            this.triggerEvent('close', e.detail, {})
        },
        onConfirm(e) {
            this.setData({value: e.detail, show: false});
            this.triggerEvent('confirm', e.detail, {})
        }
    }
});
