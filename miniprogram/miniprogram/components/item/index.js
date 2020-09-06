import Toast from '@vant/weapp/toast/toast';
import CaseNote from '../../models/caseNote.js';

let caseNoteModel = new CaseNote();

Toast.setDefaultOptions({'zIndex': '100000'});
Component({
    options: {
        styleIsolation: 'shared',
    },
    properties   : {
        'border'     : {
            type : Boolean,
            value: false
        },
        'title'      : {
            type : String,
            value: ''
        },
        'value'      : {
            type : String,
            value: null
        },
        'label'      : {
            type : String,
            value: ''
        },
        'url'        : {
            type : String,
            value: ''
        },
        'valueClass': {
            type : String,
            value: ''
        }
    },
    data         : {},
    lifetimes    : {
        created() {
            //在组件实例刚刚被创建时执行
        },
        attached() {
            // 在组件实例进入页面节点树时执行
        },
        ready() {
            //在组件在视图层布局完成后执行
        },
        moved() {
            //在组件实例被移动到节点树另一个位置时执行
        },
        detached() {
            // 在组件实例被从页面节点树移除时执行
        },
        error() {
            //每当组件方法抛出错误时执行
        }
    },
    pageLifetimes: {
        show  : function () {
            // 页面被展示
        },
        hide  : function () {
            // 页面被隐藏
        },
        resize: function (size) {
            // 页面尺寸变化
        }
    },

    methods: {
        //关闭滑动单元格
        onClose(event) {
            const {position, instance} = event.detail;
            switch (position) {
                case 'right':
                    wx.showModal({
                        content     : '删除后没法恢复，是否删除？',
                        confirmColor: '#ff0000',
                        success     : (res) => {
                            if (res.confirm) {
                                this.removeData(id);
                                instance.close();
                            }
                        }
                    });
                    break;
            }
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
                })
            } else {
                Toast.fail({
                    'message': '删除失败',
                })
            }
        },
    }
});
