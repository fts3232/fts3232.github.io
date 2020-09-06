export default function FormItem(options) {
    let defaultOptions = {
        properties: {
            'label'      : {
                type : String,
                value: '',
            },
            'placeholder': {
                type : String,
                value: '',
            },
            'value'      : {
                type : String,
                value: '',
            },
            'disabled'   : {
                type : Boolean,
                value: false
            }
        },

        data   : {
            'focus': false
        },
        methods: {
            onFocus(e) {
                this.triggerEvent('focus', e.detail, {})
                this.setData({'focus': true});
            },
            onBlur(e) {
                this.triggerEvent('blur', e.detail, {})
                this.setData({'focus': false});
            }
        },
        ready() {

        }
    };
    for (let x in options) {
        if (defaultOptions.hasOwnProperty(x) && typeof options[x] !== 'function') {
            Object.assign(defaultOptions[x], options[x]);
        } else {
            defaultOptions[x] = options[x]
        }
    }
    return Component(defaultOptions)
}