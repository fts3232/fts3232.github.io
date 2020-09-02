//index.js
import CaseNote from '../../models/caseNote';
import { dateFormat } from "../../util/util";
import Toast from '@vant/weapp/toast/toast';

let caseNoteModel = new CaseNote();

Toast.setDefaultOptions({'zIndex': '100000'});

Page({
    data             : {
        id        : null,
        result    : {},
        showEditor: false,
    },
    onDelete() {
        wx.showModal({
            content     : '删除后没法恢复，是否删除？',
            confirmColor: '#ff0000',
            success     : (res) => {
                if (res.confirm) {
                    this.removeData(this.data.id);
                } else if (res.cancel) {

                }
            }
        });
    },
    onShowEditor() {
        let editor = this.selectComponent('#editor');
        let {category, type, date, amount, remark} = this.data.result;
        date = date.replace('-', '/');
        let data = {
            category,
            type,
            date: new Date(date).getTime(),
            amount,
            remark
        };
        editor.setData({form: data});
        this.setData({'showEditor': true})
    },
    onConfirmEditor(e) {
        this.updateData(e.detail);
    },
    async removeData(id) {
        Toast.loading({
            message : '加载中',
            mask    : true,
            duration: 0
        });
        let result = await caseNoteModel.remove(id);
        if (result) {
            Toast.success({
                'message': '删除成功',
            });
            const pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
            const prevPage = pages[pages.length - 2];
            prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
                refreshData: true
            });
            wx.navigateBack();
        } else {
            Toast.fail({
                'message': '删除失败',
            })
        }
    },
    async updateData(data) {
        Toast.loading({
            message : '加载中',
            mask    : true,
            duration: 0,
        });
        data.amount = Number(data.amount);
        data.date = dateFormat(data.date, 'Y-m-d');
        let {id} = this.data;
        let result = await caseNoteModel.update(id, data);

        if (result) {
            let changeData = {
                'showEditor': false,
                'result'    : {
                    type    : data.type,
                    category: data.category,
                    date    : data.date,
                    amount  : data.amount,
                    remark  : data.remark
                }
            };
            Toast.success({
                'message': '修改成功',
            });
            this.setData(changeData);
            const pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
            const prevPage = pages[pages.length - 2];
            prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
                refreshData: true
            });
        } else {
            Toast.fail({
                'message': '修改失败',
            });
        }
    },
    async getData() {
        let result = await caseNoteModel.get({'id': this.data.id});
        this.setData({result});
    },
    onLoad           : function (options) {
        // 页面创建时执行
        this.setData({id: options.id})
    },
    onShow           : function () {
        // 页面出现在前台时执行
    },
    onReady          : function () {
        // 页面首次渲染完毕时执行
        this.getData();
    },
    onHide           : function () {
        // 页面从前台变为后台时执行
    },
    onUnload         : function () {
        // 页面销毁时执行
    },
    onPullDownRefresh: function () {
        // 触发下拉刷新时执行
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
