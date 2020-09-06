import Toast from '@vant/weapp/toast/toast';

Toast.setDefaultOptions({'zIndex': '100000'});
Component({
    properties: {
        'show'     : {
            type : Boolean,
            value: false
        },
        categoryMap: {
            type : Object,
            value: {}
        },
    },

    data         : {
        showDatePicker    : false,
        showCategoryPicker: false,
        input             : {
            maxLength  : null,
            type       : null,
            title      : null,
            placeholder: null,
            show       : false,
            focus      : false,
            name       : null,
            value      : null
        },
        form              : {
            type    : null,
            category: null,
            date    : new Date().getTime(),
            amount  : '',
            remark  : ''
        },
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
        onClose() {
            this.setData({'show': false});
        },
        //时间选择器
        onShowDatePicker(e) {
            this.setData({
                'showDatePicker': true,
                'show'          : false,
            });
        },
        onCloseDatePicker() {
            this.setData({
                'show': true
            });
        },
        onConfirmDatePicker(e) {
            let data = {
                ["form.date"]: e.detail,
                'show'       : true
            };
            this.setData(data);
        },
        //类型选择器
        onShowCategoryPicker() {
            let data = {
                'showCategoryPicker': true,
                'show'              : false,
            };
            this.setData(data);
        },
        onCloseCategoryPicker() {
            let data = {
                'show': true
            };
            this.setData(data);
        },
        onConfirmCategoryPicker(e) {
            let data = {
                ["form.category"]: e.detail.name,
                ["form.type"]    : e.detail.type,
                'show'           : true
            };
            this.setData(data);
        },
        //编辑器 - 输入
        onShowInput(e) {
            let data = {
                ["input.show"] : true,
                ["input.value"]: null,
                'show'         : false,
            };
            this.setData(data, () => {
                setTimeout(() => {
                    this.setData({["input.focus"]: true})
                }, 100)
            });
        },
        onCloseInput(e) {
            let data = {
                'show': true
            };
            this.setData(data);
        },
        onConfirmInput(e) {
            let data = {
                'show'         : true,
                ["input.show"] : false,
                ["input.focus"]: false,
                ["form.remark"]: e.detail.value
            };
            this.setData(data);
        },
        //数字键盘点击
        onTapKeyboard(e) {
            let {key} = e.target.dataset;
            let {form} = this.data;
            let {amount} = form;
            amount = String(amount);
            switch (key) {
                case 'confirm':
                    try {
                        if (!amount || (amount && amount < 0.01)) {
                            throw '金额不能小于0.01';
                        }
                        if (!form.category) {
                            throw '请选择类型';
                        }

                    } catch ( err ) {
                        if (err) {
                            Toast({
                                'message': err,
                            });
                        }
                        break;
                    }
                    this.setData({
                        'form': {
                            type    : null,
                            category: null,
                            date    : new Date().getTime(),
                            amount  : '',
                            remark  : ''
                        }
                    });
                    this.triggerEvent('confirm', {...form});
                    break;
                case 'cancel':
                    amount = amount.substring(0, amount.length - 1);
                    form.amount = amount;
                    this.setData({form});
                    break;
                default:
                    try {
                        let last = amount.substr(-1, 1);
                        let hasPoint = amount.indexOf('.');
                        let length = amount.length;
                        if (hasPoint !== -1 && (key === '.' || length - hasPoint > '2')) {
                            throw '';
                        }
                        if (key === '.' && !amount) {
                            amount = '0.';
                        } else if (last === '0' && key !== '.' && hasPoint === -1) {
                            amount = String(key);
                        } else {
                            amount += key;
                        }
                        if (amount > 10000000) {
                            throw '金额不能大于10,000,000';
                        }
                        form.amount = amount;
                        this.setData({form});
                    } catch ( err ) {
                        if (err) {
                            Toast({
                                'message': err,
                            });
                        }
                        break;
                    }
            }
        },
    }
});
