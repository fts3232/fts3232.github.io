function isEmpty(data) {
    if (data == null || typeof data === "undefined") {
        return true;
    } else if (Array.isArray(data)) {
        return data.length < 1;
    } else if (typeof data === 'object') {
        return JSON.stringify(data) === '{}';
    }
    return false;
}

function dateFormat(date, fmt) {
    //苹果只支持XXXX/XX/XX 这样的时间格式，如果不转换会显示NaN
    if (typeof date === 'string') {
        date = date.replace('-', '/');
    }
    let d;
    if (date instanceof Date) {
        d = date;
    } else {
        if (date) {
            d = new Date(date);
        } else {
            d = new Date();
        }
    }
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let seconds = d.getSeconds();
    let minutes = d.getMinutes();
    let hours = d.getHours();
    let weekText = {
        "0": '星期天',
        "1": '星期一',
        "2": '星期二',
        "3": '星期三',
        "4": '星期四',
        "5": '星期五',
        "6": '星期六'
    };
    let replaceText = {
        "Y": d.getFullYear(), //年份
        "n": month, //月份
        "m": month < 10 ? '0' + month : month, //月份 有前导0,
        "d": day < 10 ? '0' + day : day, //月份中的第几天 有前导0,
        "j": day,//月份中的第几天
        "w": weekText[d.getDay().toString()],//星期中的第几天,
        "H": hours < 10 ? '0' + hours : hours,//24小时格式，有前导0,
        "h": hours > 12 ? (hours - 12 < 10 ? '0' + (hours - 12) : hours - 12) : hours,//12小时格式，有前导0,
        "G": hours,//24小时格式,
        "g": hours > 12 ? hours - 12 : hours,//12小时格式,
        "i": minutes < 10 ? '0' + minutes : minutes,//分钟格式，有前导0,
        "s": seconds < 10 ? '0' + seconds : seconds,//秒格式，有前导0
        "A": hours > 12 ? 'PM' : 'AM',//大写上下午
        "a": hours > 12 ? 'pm' : 'am',//小写上下午
    };
    for (let x in replaceText) {
        fmt = fmt.replace(x, replaceText[x]);
    }
    return fmt;
}

export {
    isEmpty,
    dateFormat
};