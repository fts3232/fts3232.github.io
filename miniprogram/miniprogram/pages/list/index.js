//index.js
import Toast from '@vant/weapp/toast/toast';
import CaseNote from '../../models/caseNote.js';
import { isEmpty } from '../../util/util.js';

let caseNoteModel = new CaseNote();
Toast.setDefaultOptions({'zIndex': '100000'});
Page({
    data             : {
        refresherEnabled: true,
        refreshStatus   : false,
        date            : null,
        type            : null,
        category        : null,
        total           : 0,
        list            : [],
        sort            : 'amount',
        refreshData     : false,
        skip            : 0,
        isEnd           : false,
    },
    onChangeSort(e) {
        let {val} = e.target.dataset;
        this.setData({sort:val, isEnd: false, skip: 0, list: []}, () => {
            this.fetchData();
        })
    },
    async fetchData() {
        Toast.loading({
            message : '加载中',
            mask    : true,
            duration: 0,
        });
        let {date, type, category, skip, list,sort} = this.data;
        if (sort === 'date') {
            sort = {
                'date'       : -1,
                'createdTime': -1
            }
        } else {
            sort = {
                'amount': -1
            };
        }
        let data = {
            refreshData: false,
        };
        let total = await caseNoteModel.getTotal({'year-month': date, type, category});
        if (total) {
            data['total'] = total;
        }
        let result = await caseNoteModel.getList({'year-month': date, type, category, sort, skip, limit: 10});
        if (!isEmpty(result)) {
            if (result.length < 10) {
                data['isEnd'] = true;
            }
            data['list'] = list.concat(result);
        } else {
            data['isEnd'] = true;
        }
        data['skip'] = skip + 10;
        this.setData(data);
        Toast.clear();
    },
    onLoad           : function (options) {
        // 页面创建时执行
        //console.log(options)
        let data = {};
        if (typeof options.category !== 'undefined') {
            data['category'] = options.category;
        }
        if (typeof options.type !== 'undefined') {
            data['type'] = Number(options.type);
        }
        if (typeof options.date !== 'undefined') {
            data['date'] = options.date;
        }
        this.setData(data, () => {
            this.fetchData();
        })

    },
    onShow           : function () {
        // 页面出现在前台时执行
        if (this.data.refreshData) {
            this.fetchData();
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
        this.setData({'isEnd': false, 'skip': 0, 'list': []}, () => {
            this.fetchData()
                .finally(() => {
                    this.setData({refreshStatus: false});
                });
        });
    },
    onReachBottom    : function () {
        let {isEnd} = this.data;
        if (!isEnd) {
            this.fetchData();
        }
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
