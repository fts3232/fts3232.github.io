//index.js
const d = new Date();
import Toast from '@vant/weapp/toast/toast';
import { dateFormat, isEmpty } from '../../util/util.js';
import CaseNote from '../../models/caseNote.js';

let caseNoteModel = new CaseNote();

Toast.setDefaultOptions({'zIndex': '100000'});

Page({
    data             : {
        refresherEnabled  : true,
        refreshStatus     : false,
        aggregatedData    : {
            equity: 0,
            income: 0,
            expend: 0,
        },
        showEditor        : false,
        list              : {},
        showDatePicker    : false,
        showCategoryPicker: false,
        form              : {
            type    : null,
            category: null,
            date    : d.getTime()
        },
        refreshData       : false,
    },
    //时间选择器
    onShowDatePicker(e) {
        this.setData({
            'showDatePicker': true
        });
    },
    onConfirmDatePicker(e) {
        let data = {
            ['form.date']: e.detail
        };
        this.setData(data, () => {
            this.fetchData();
        });
    },
    //类型选择器
    onShowCategoryPicker() {
        let data = {
            'showCategoryPicker': true
        };
        this.setData(data);
    },
    onConfirmCategoryPicker(e) {
        let data = {
            ['form.category']: e.detail.name,
            ['form.type']    : e.detail.type
        };
        this.setData(data, () => {
            this.fetchData();
        });
    },
    //编辑器
    onShowEditor() {
        this.setData({'showEditor': true});
    },
    onConfirmEditor(e) {
        this.addData(e.detail);
    },
    async removeData(id, date) {
        Toast.loading({
            message : '加载中',
            mask    : true,
            duration: 0
        });
        let result = await caseNoteModel.remove(id);
        if (result) {
            let listData = this.calculateListData({
                action: 'delete',
                date,
                id
            });
            if (listData) {
                this.setData(listData);
            }
            Toast.success({
                'message': '删除成功',
            })
        } else {
            Toast.fail({
                'message': '删除失败',
            })
        }
    },
    //添加数据
    async addData(data) {
        Toast.loading({
            message : '加载中',
            mask    : true,
            duration: 0,
        });
        data.amount = Number(data.amount);
        data.date = dateFormat(data.date, 'Y-m-d');
        let result = await caseNoteModel.add(data);

        if (result) {
            let changeData = {
                'showEditor': false,
            };
            Toast.success({
                'message': '添加成功',
            });
            let listData = this.calculateListData({
                action  : 'add',
                date    : data.date,
                id      : result,
                amount  : data.amount,
                category: data.category,
                remark  : data.remark,
                type    : data.type
            });
            if (listData) {
                Object.assign(changeData, listData);
            }
            this.setData(changeData)
        } else {
            Toast.fail({
                'message': '添加失败',
            });
        }
    },
    //获取数据
    async fetchData() {
        Toast.loading({
            message : '加载中',
            mask    : true,
            duration: 0,
        });

        let {form} = this.data;
        let data = {
            list          : {},
            aggregatedData: {
                expend: 0,
                income: 0,
                equity: 0
            },
            refreshData   : false
        };

        let startTime = new Date(form.date);
        startTime.setDate(1);
        startTime = dateFormat(startTime, 'Y-m-d');

        let endTime = new Date(form.date);
        endTime.setMonth(endTime.getMonth() + 1);
        endTime.setDate(0);
        endTime = dateFormat(endTime, 'Y-m-d');

        let options = {
            startTime,
            endTime
        };
        if (!isEmpty(form.category)) {
            options['category'] = form.category;
            options['type'] = form.type;
        }

        let result = await caseNoteModel.getTotal(options);
        if (result) {
            data.aggregatedData.expend = result.expend;
            data.aggregatedData.income = result.income;
            if (isEmpty(form.category)) {
                data.aggregatedData.equity = data.aggregatedData.income - data.aggregatedData.expend;
            }
        }

        result = await caseNoteModel.getListGroupByDate(options);
        if (result) {
            data.list = result;
        }
        this.setData(data);
        Toast.clear();
    },
    calculateListData(obj) {
        let {aggregatedData, form, list} = this.data;
        let {date, id, action, type, category, remark, amount} = obj;
        let changeData = {};
        switch (action) {
            case 'add':
                if (dateFormat(date, 'Y-m') === dateFormat(form.date, 'Y-m') && (!form.category || (form.category && category === form.category && type === form.type))) {

                    if (typeof list[date] === 'undefined') {
                        list[date] = {
                            expend: 0,
                            income: 0,
                            list  : []
                        }
                    }
                    list[date].list.unshift({
                        id,
                        type,
                        amount,
                        date,
                        category,
                        remark
                    });
                    if (type === 0) {
                        list[date].expend += amount;
                        aggregatedData.expend += amount;
                    } else {
                        list[date].income += amount;
                        aggregatedData.income += amount;
                    }
                    aggregatedData.equity = aggregatedData.income - aggregatedData.expend;
                    changeData = {list, aggregatedData};
                }
                break;
            case 'delete':
                if (typeof list[date] !== 'undefined') {
                    let index = list[date]['list'].findIndex((currentValue) => {
                        return currentValue.id === id;
                    });
                    if (index !== -1) {
                        amount = list[date]['list'][index].amount;
                        type = list[date]['list'][index].type;
                        list[date]['list'].splice(index, 1);
                        if (list[date]['list'].length === 0) {
                            delete list[date];
                        } else {
                            if (type === 0) {
                                list[date].expend -= amount;
                            } else {
                                list[date].income -= amount;
                            }
                        }

                        if (type === 0) {
                            aggregatedData.expend -= amount;
                        } else {
                            aggregatedData.income -= amount;
                        }
                        aggregatedData.equity = aggregatedData.income - aggregatedData.expend;
                        changeData = {list, aggregatedData};
                    }
                }
                break;
        }
        return changeData;
    },
    onLoad           : function (options) {
        // 页面创建时执行
        //console.log(options)
    },
    onShow           : function () {
        if (this.data.refreshData) {
            this.fetchData();
        }
        // 页面出现在前台时执行
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                active: 0
            })
        }
    },
    onReady          : function () {
        // 页面首次渲染完毕时执行
        this.fetchData();
    },
    onHide           : function () {
        // 页面从前台变为后台时执行
    },
    onUnload         : function () {
        // 页面销毁时执行
    },
    onPullDownRefresh: function () {
        // 触发下拉刷新时执行
        this.fetchData()
            .finally(() => {
                this.setData({refreshStatus: false});
            });
    },
    onReachBottom    : function () {
        // 页面触底时执行
        console.log(1)
    },
    onShareAppMessage: function () {
        // 页面被用户分享时执行
    },
    onPageScroll     : function (e) {
        // 页面滚动时执行
    },
    onResize         : function () {
        // 页面尺寸变化时执行
    },
})
