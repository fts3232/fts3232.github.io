import FormItem from 'FormItem.js';

FormItem({
    properties: {
        'type': {
            type : String,
            value: 'text'
        }
    },

    data: {},

    methods: {
        onInput(e) {
            this.triggerEvent('input', e.detail, {})
        },
        onConfirm(e){
            this.triggerEvent('confirm', e.detail, {})
        }
    },

    ready() {

    },
});
