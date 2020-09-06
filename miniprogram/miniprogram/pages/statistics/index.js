//index.js
import Toast from '@vant/weapp/toast/toast';
import { dateFormat, isEmpty } from "../../util/util";
import CaseNote from '../../models/caseNote';

let caseNoteObj = new CaseNote();
Toast.setDefaultOptions({'zIndex': '100000'});
const d = new Date();
Page({
    data             : {
        refreshData     : false,
        refresherEnabled: true,
        refreshStatus   : false,
        currentDate     : d.getTime(),
        currentMonth    : dateFormat(d, 'Y-m'),
        list            : {},
        switch          : {
            1: 0,
            2: 0,
            3: 0
        },
        chart           : {
            month: {
                limit   : 6,
                selected: null,
            },
            date : {
                limit   : 30,
                selected: null,
                toView  : null,
            }
        },
        showDatePicker  : false
    },
    //时间选择器
    onShowDatePicker(e) {
        this.setData({showDatePicker: true});
    },
    onConfirmDate(e) {
        let data = {
            "currentDate"   : e.detail,
            "currentMonth"  : dateFormat(e.detail, 'Y-m'),
            "showDatePicker": false
        };
        this.setData(data, () => {
            this.fetchData()
        });

    },
    //切换类型
    onChangeType(e) {
        try {
            let {id, val} = e.target.dataset;
            let {currentMonth, chart} = this.data;
            let data,
                originVal = this.data["switch." + id];
            if (originVal == val) {
                throw '';
            }
            data = {["switch." + id]: val};
            if (id == 3) {
                data["chart.month.selected"] = currentMonth;
            } else if (id == 2) {
                data["chart.date.selected"] = chart.date.limit - 1;
                data["chart.date.toView"] = 'date' + (chart.date.limit - 1)
            }
            if (id == 2 || id == 3) {
                this.clearAnimation('.percentage', {}, () => {
                    console.log("清除动画");
                    this.setData(data, () => {
                        let selector = id == 2 ? '.chart-date .percentage' : '.chart-month .percentage';
                        this.animate(selector, [
                            {height: 'var(--min-height)'},
                            {height: 'var(--height)'},
                        ], 1000, () => {
                            this.clearAnimation('.percentage', {}, function () {
                                console.log("清除动画")
                            })
                        })
                    });
                })
            } else {
                this.setData(data);
            }
        } catch ( err ) {
            console.log(err)
        }

    },
    //点击图表
    onTapChart(e) {
        let {type, index} = e.currentTarget.dataset;
        this.setData({['chart.' + type + '.selected']: index});
        if (type === 'month') {
            this.getRank(index);
        }
    },
    async getRank(date) {
        Toast.loading({
            message : '加载中',
            mask    : true,
            duration: 0,
        });
        let {list} = this.data;
        let rank = await caseNoteObj.getListGroupByType({date: date, limit: 3});
        if (rank) {
            rank.map((v) => {
                if (v['_id'] === 0) {
                    list['list'][date]['expend']['rank'] = v['list']
                } else {
                    list['list'][date]['income']['rank'] = v['list']
                }
            });
        }
        this.setData({list});
        Toast.clear();
    },
    //获取数据
    async fetchData() {
        Toast.loading({
            message : '加载中',
            mask    : true,
            duration: 0,
        });
        let {chart, currentMonth, currentDate} = this.data;
        currentDate = new Date(currentDate);
        let monthMap = [];

        for (let i = chart.month.limit - 1; i >= 0; i--) {
            let date = new Date();
            date.setMonth(currentDate.getMonth() - i);
            date = dateFormat(date, 'Y-m');
            monthMap.push(date);
        }

        let dateMap = [];
        for (let i = chart.date.limit - 1; i >= 0; i--) {
            let date = new Date(currentDate - i * 24 * 3600 * 1000);
            date = dateFormat(date, 'Y-m-d');
            dateMap.push(date);
        }
        let monthList = await caseNoteObj.getTotalGroupByMonth({date: monthMap});
        if (monthList) {
            let composition = await caseNoteObj.getTotalGroupByCategory({date: currentMonth});
            if (composition) {
                composition.map((v) => {
                    if (v['_id']['type'] === 0) {
                        monthList['list'][currentMonth]['expend']['composition'].push({
                            'category': v['_id']['category'],
                            'total'   : v['total']
                        })
                    } else {
                        monthList['list'][currentMonth]['income']['composition'].push({
                            'category': v['_id']['category'],
                            'total'   : v['total']
                        })
                    }
                });
            }
            let rank = await caseNoteObj.getListGroupByType({date: currentMonth, limit: 3});
            if (rank) {
                rank.map((v) => {
                    if (v['_id'] === 0) {
                        monthList['list'][currentMonth]['expend']['rank'] = v['list']
                    } else {
                        monthList['list'][currentMonth]['income']['rank'] = v['list']
                    }
                });
            }
            let dateList = await caseNoteObj.getTotalGroupByDate({date: dateMap});
            if (dateList) {
                monthList['list'][currentMonth]['list'] = dateList;
            }
            this.setData({
                ["chart.month.selected"]: currentMonth,
                ["chart.date.selected"] : chart.date.limit - 1,
                ["chart.date.toView"]   : 'date' + (chart.date.limit - 1),
                list                    : monthList,
            }, () => {
                this.animate('.percentage', [
                    {height: 'var(--min-height)'},
                    {height: 'var(--height)'},
                ], 1000, () => {
                    this.clearAnimation('.percentage', {}, function () {
                        console.log("清除动画")
                    })
                })
            })

        }
        Toast.clear();
    },
    onLoad           : function (options) {
        // 页面创建时执行
        //console.log(options)
        this.fetchData();
    },
    onShow           : function () {
        if (this.data.refreshData) {
            this.fetchData();
        }
        // 页面出现在前台时执行
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                active: 1
            })
        }
    },
    onReady          : function () {
        // 页面首次渲染完毕时执行
    },
    onHide           : function () {
        // 页面从前台变为后台时执行
    },
    onUnload         : function () {
        // 页面销毁时执行
    },
    onPullDownRefresh: function () {
        // 触发下拉刷新时执行
        this.fetchData().finally(() => {
            this.setData({refreshStatus: false});
        });
    },
    onReachBottom    : function () {
        // 页面触底时执行
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
