import FormItem from 'FormItem.js';

FormItem({
    properties: {
        'maxlength': {
            type : Number,
            value: 140
        }
    },

    data   : {},

    methods: {
        onInput(e) {
            this.triggerEvent('input', e.detail, {})
        },
        onConfirm(e) {
            this.triggerEvent('confirm', e.detail, {})
        }
    }
});
