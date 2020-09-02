Component({
    properties: {
        'show'       : {
            type : Boolean,
            value: false
        },
        'maxLength'  : {
            type : Number,
            value: 0
        },
        'title'      : {
            type : String,
            value: ''
        },
        'value':{
            type : String,
            value: null
        },
        'placeholder': {
            type : String,
            value: ''
        },
        'focus'      : {
            type : Boolean,
            value: false
        }
    },

    data         : {

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
            this.setData({'show': false, 'focus': false});
            this.triggerEvent('close', e.detail, {});
        },
        onConfirm(e) {
            let {value} = this.data;
            this.triggerEvent('confirm', {value}, {});
        },
        onChange(e) {
            this.setData({'value': e.detail})
        }
    }
});
