// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const {OPENID} = cloud.getWXContext()
    console.log({
        touser           : 'oYk6_4imiVGf48X-Tc1QREcKyuTc',
        templateId       : 'Gi046eRQRFcopL7Sa-P450rL9PD7rtv4KlPdBYIrBmM',
        miniprogram_state: 'developer',
        page             : 'pages/index/index',
        // 此处字段应修改为所申请模板所要求的字段
        data             : {
            thing1 : {
                value: '2018年6月5日账单',
            },
            amount2: {
                value: '￥60.00',
            },
        }
    })
    const sendResult = await cloud.openapi.subscribeMessage.send({
        touser           : 'oYk6_4imiVGf48X-Tc1QREcKyuTc',
        templateId       : 'Gi046eRQRFcopL7Sa-P450rL9PD7rtv4KlPdBYIrBmM',
        //miniprogram_state: 'developer',
        //page             : 'pages/index/index',
        // 此处字段应修改为所申请模板所要求的字段
        data             : {
            thing1 : {
                value: '2018年6月5日账单',
            },
            amount2: {
                value: '￥60.00',
            },
        }
    })
}