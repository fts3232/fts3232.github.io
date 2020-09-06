import categoryMap from "../../data/categoryMap";
import Toast from '@vant/weapp/toast/toast';

let customCategory = wx.getStorageSync('customCategory');
if (customCategory) {
    categoryMap.map(function (v, i) {
        categoryMap[i] = categoryMap[i].concat(customCategory[i]);
    });
}

Toast.setDefaultOptions({'zIndex': '100000'});

Component({
    properties: {
        'show': {
            type : Boolean,
            value: false
        },

        'value'  : {
            type : null,
            value: null
        },
        'type'   : {
            type : null,
            value: null
        },
        'showAdd': {
            type : Boolean,
            value: false,
        }
    },

    data         : {
        map  : categoryMap,
        input: {
            show : false,
            value: null,
            type : null
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
            this.setData({'show': false});
            this.triggerEvent('close', e.detail, {})
        },
        onConfirm(e) {
            let {name, type} = e.currentTarget.dataset;
            name = typeof name !== 'undefined' ? name : null;
            type = typeof type !== 'undefined' ? type : null;
            let data = {
                show : false,
                value: name,
                type
            };
            this.setData(data);
            this.triggerEvent('confirm', {name, type})
        },
        //编辑器 - 输入
        onShowInput(e) {
            let {type} = e.currentTarget.dataset;
            let data = {
                ["input.show"] : true,
                ["input.value"]: null,
                ["input.type"] : type,
                'show'         : false
            };
            this.setData(data, () => {
                setTimeout(() => {
                    this.setData({["input.focus"]: true})
                }, 100)
            });
        },
        onCloseInput(e) {
            let data = {'show': true};
            this.setData(data);
        },
        onConfirmInput(e) {
            let {type} = this.data.input;
            let data = {'show': true, ["input.show"]: false, ["input.focus"]: false};
            let {value} = e.detail;
            let {map} = this.data;
            if (map[type].includes(value)) {
                Toast({
                    'message': '该类型已存在',
                });
                return false;
            } else {
                map[type].push(value);
                data["map"] = map;
                data['value'] = value;
                data['type'] = type;
                let customCategory = wx.getStorageSync('customCategory');
                if (!customCategory) {
                    customCategory = [[], []];
                }
                customCategory[type].push(value);
                wx.setStorage({
                    key : 'customCategory',
                    data: customCategory
                })
            }
            this.setData(data);
        }
    }
});
