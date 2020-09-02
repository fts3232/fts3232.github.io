Component({
    options   : {
        virtualHost: true
    },
    properties: {
        'type'    : {
            type : String,
            value: 'primary'
        },
        'size':{
            type:String,
            value:'default'
        },
        'disabled': {
            type : Boolean,
            value: false
        },
        'plain'   : {
            type : Boolean,
            value: false
        },
        'oneType' : {
            type : String,
            value: ''
        },
        'loading' : {
            type : Boolean,
            value: false
        }
    },

    data: {},

    methods: {

    },

    ready() {

    }
});
