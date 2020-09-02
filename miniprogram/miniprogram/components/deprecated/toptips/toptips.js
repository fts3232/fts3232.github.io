Component({
    options: {
        styleIsolation: 'shared'
    },
    properties: {
        'type'    : {
            type : String,
            value: ''
        },
        'show': {
            type : Boolean,
            value: false
        },
        'msg'   : {
            type : String,
            value: ''
        },
        'delay' : {
            type : Number,
            value: 2000
        }
    },

    data: {},

    methods: {
        show(options){
            options['show'] = true;
            this.setData(options)
        }
    },

    ready() {

    }
});
