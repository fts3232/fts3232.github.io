import FormItem from 'FormItem.js';

FormItem({
    properties: {
        'mode'     : {
            type : String,
            value: 'selector'
        },
        'value'    : {
            type         : String,
            optionalTypes: [Array, Number],
            value        : '',
        },
        'range'    : {
            type         : Array,
            optionalTypes: [Object],
            value        : []
        },
        'rangeKey' : {
            type : String,
            value: ''
        },
    },

    data: {
        'text' : null,
        'index': [],
    },

    methods: {
        showText() {
            let {mode, value, range, rangeKey} = this.data;
            if (mode === 'selector') {
                this.setData({text: rangeKey ? range[value][rangeKey] : range[value]});
            } else if (mode === 'multiSelector') {
                let text = [];
                value.map(function (i, k) {
                    text.push(rangeKey ? range[k][i][rangeKey] : range[k][i])
                })
                text = text.join(' - ');
                this.setData({text});
            } else {
                this.setData({text: value});
            }
        },
        onChange(e) {
            let value = e.detail.value;
            this.setData({'focus': false, value: value}, () => {
                this.showText();
            });
            this.triggerEvent('change', e.detail, {})
        },
        onColumnChange(e) {
            this.triggerEvent('columnchange', e.detail, {})
        },
        onCancel(e) {
            this.setData({'focus': false});
            this.triggerEvent('cancel', e.detail, {})
        }
    },
    lifetimes: {
        attached: function() {
            // 在组件实例进入页面节点树时执行
        },
        ready() {

        },
        detached: function() {
            // 在组件实例被从页面节点树移除时执行
        },
    },

    observers: {
        'value': function(value) {
            let {mode} = this.data;
            if (mode === 'multiSelector') {
                this.setData({'index': value});
            }
            this.showText();
        }
    }
});
