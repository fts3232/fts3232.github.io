//index.js

Component({
    properties: {
        formData: {
            type : Object,
            value: {
                date    : new Date()/*.format('yyyy-MM-dd')*/,
                amount  : null,
                remark  : null,
                category: [0, 0],
            },
        },
    },
    data      : {
        show         : false,
        rules        : [
            {
                name : 'date',
                rules: {required: true, message: '请选择日期'},
            }, {
                name : 'category',
                rules: {required: true, message: '请选择项目'},
            }, {
                name : 'amount',
                rules: {required: true, message: '请填写金额'},
            }, {
                name : 'remark',
                rules: {required: true, message: '请填写备注'},
            }
        ],
        typeArray    : [
            {
                value: 0,
                name : '支出'
            },
            {
                value: 1,
                name : '收入'
            }
        ],
        categoryArray: [
            [
                {
                    value: 0,
                    name : '餐饮'
                },
                {
                    value: 1,
                    name : '住宿'
                },
                {
                    value: 2,
                    name : '游戏'
                }
            ],
            [
                {
                    value: 0,
                    name : '工资'
                },
                {
                    value: 1,
                    name : '其他'
                }
            ]
        ],
        column       : 0,
    },
    methods   : {
        onReset() {
            this.setData({
                formData: {
                    date    : new Date().format('yyyy-MM-dd'),
                    amount  : null,
                    remark  : null,
                    category: [0, 0],
                }
            });
        },
        onSubmit() {
            this.selectComponent('#form').validate((valid, errors) => {
                if (!valid) {
                    const firstError = Object.keys(errors);
                    if (firstError.length) {
                        this.selectComponent('#toptips').show({
                            'type': 'error',
                            'msg' : errors[firstError[0]].message
                        })
                    }
                } else {
                    wx.showLoading({
                        title  : '提交中',
                        mask   : true,
                        success: () => {
                            setTimeout(() => {
                                wx.hideLoading();
                                this.selectComponent('#toptips').show({
                                    'type': 'success',
                                    'msg' : '添加成功'
                                })
                            }, 2000)
                        }
                    });
                }
            });
            /*const db = wx.cloud.database();
            const cateNote = db.collection('CASE_NOTE');
            Toast.loading({
                mask       : true,
                forbidClick: true,
                duration   : 0,
                message    : '提交中...',
            });
            let {form} = this.data;
            form.createTime = new Date().toDateString();
            form.amount = Number(form.amount);
            cateNote.add({
                // data 字段表示需新增的 JSON 数据
                data: form
            }).then(res => {
                Toast.success({
                    mask       : true,
                    forbidClick: true,
                    message    : '添加成功',
                });
            }).catch(err => {
                Toast.fail({
                    mask       : true,
                    forbidClick: true,
                    message    : '添加失败',
                });
            })*/
        },
        onColumnChange(e) {
            let {column, value} = e.detail;
            if (column === 0) {
                this.setData({
                    column: value
                })
            }
        },
        onInput(e) {
            let form = this.data.formData;
            let {name} = e.target.dataset;
            form[name] = e.detail.value;
            this.setData({form})
        },
    },
    lifetimes : {
        created() {
        },

        attached() {
            // 在组件实例进入页面节点树时执行
        },
        ready() {
            this.setData({'show': true});
        },
        detached() {
            // 在组件实例被从页面节点树移除时执行
        },
    }
})
