import { dateFormat, isEmpty } from "../util/util";

class CaseNote {
    constructor() {
        this.db = wx.cloud.database();
        this.collection = this.db.collection('CASE_NOTE');
        this.command = this.db.command;
        this.aggregate = this.command.aggregate;
    }

    getWhere(options) {
        let where = {};
        if (typeof options.startTime !== 'undefined' && options.startTime != null) {
            if (typeof options.endTime !== 'undefined' && options.endTime != null) {
                where['date'] = this.command.and(this.command.gte(options.startTime), this.command.lte(options.endTime))
            } else {
                where['date'] = this.command.gte(options.startTime)
            }
        }
        if (typeof options.date !== 'undefined' && options.date != null) {
            if (Array.isArray(options.date)) {
                where['date'] = this.command.in(options.date);
            } else {
                where['date'] = options.date;
            }
        }
        if (typeof options.category !== 'undefined' && options.category != null) {
            where['category'] = options.category;
        }
        if (typeof options.type !== 'undefined' && options.type != null) {
            where['type'] = options.type;
        }
        if (typeof options.id !== 'undefined' && options.id != null) {
            where['_id'] = options.id;
        }
        return where;
    }

    getTotal(options) {
        let where = this.getWhere(options);
        return this.collection
            .aggregate()
            .project({
                'year-month': this.aggregate.concat([
                    this.aggregate.arrayElemAt([this.aggregate.split(['$date', '-']), 0]),
                    '-',
                    this.aggregate.arrayElemAt([this.aggregate.split(['$date', '-']), 1])
                ]),
                'date'      : 1,
                'category'  : 1,
                'type'      : 1,
                'amount'    : 1
            })
            .match(where)
            .group({
                _id  : '$type',
                total: this.aggregate.sum('$amount')
            })
            .sort({
                '_id': 1
            })
            .end()
            .then((result) => {
                let returnResult = {'expend': 0, 'income': 0};
                let hasType = typeof options.type !== 'undefined';
                if (hasType) {
                    returnResult = 0;
                }
                if (!isEmpty(result.list)) {
                    result.list.map((v) => {
                        if (hasType) {
                            returnResult = v['total'];
                        } else {
                            if (v['_id'] === 0) {
                                returnResult.expend = v['total'];
                            } else {
                                returnResult.income = v['total'];
                            }
                        }
                    });
                }
                return returnResult;
            })
            .catch((err) => {
                console.log(err);
                return false;
            });
    }

    get(options) {
        let where = this.getWhere(options);
        return this.collection
            .field({
                _id     : 1,
                date    : 1,
                category: 1,
                type    : 1,
                amount  : 1,
                remark  : 1
            })
            .where(where)
            .limit(1)
            .get()
            .then((result) => {
                return !isEmpty(result['data']) ? result['data'][0] : {};
            }).catch((err) => {
                console.log(err);
                return false;
            })
    }

    getList(options) {
        let where = this.getWhere(options);
        let sort = {};
        let skip = 0;
        if (typeof options.sort !== 'undefined') {
            sort = options.sort;
        }
        let limit = 0;
        if (typeof options.limit !== 'undefined') {
            limit = options.limit;
        }
        if (typeof options.skip !== 'undefined') {
            skip = options.skip;
        }
        return this.collection
            .aggregate()
            .project({
                _id         : 1,
                'year-month': this.aggregate.concat([
                    this.aggregate.arrayElemAt([this.aggregate.split(['$date', '-']), 0]),
                    '-',
                    this.aggregate.arrayElemAt([this.aggregate.split(['$date', '-']), 1])
                ]),
                date        : 1,
                category    : 1,
                type        : 1,
                amount      : 1,
                createdTime : 1,
                remark      : 1
            })
            .match(where)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .end()
            .then((result) => {
                return !isEmpty(result['list']) ? result['list'] : {};
            }).catch((err) => {
                console.log(err);
                return false;
            })
    }

    getListGroupByType(options) {
        let where = this.getWhere(options);
        return this.collection
            .aggregate()
            .project({
                'date'    : this.aggregate.concat([this.aggregate.arrayElemAt([this.aggregate.split(['$date', '-']), 0]), '-', this.aggregate.arrayElemAt([this.aggregate.split(['$date', '-']), 1])]),
                'type'    : 1,
                'amount'  : 1,
                'category': 1,
            })
            .match(where)
            .sort({
                amount: -1,
            })
            .group({
                _id : '$type',
                list: this.aggregate.push({
                    id      : '$_id',
                    category: '$category',
                    amount  : '$amount',
                    date    : '$date'
                })
            })
            .project({
                list: this.aggregate.slice(['$list', options.limit]),
            })
            .sort({
                _id: 1,
            })
            .end()
            .then((res) => {
                return res.list;
            })
            .catch((err) => {
                console.log(err);
                return false;
            })
    }

    getTotalGroupByCategory(options) {
        let where = this.getWhere(options);
        return this.collection
            .aggregate()
            .project({
                'date'    : this.aggregate.concat([this.aggregate.arrayElemAt([this.aggregate.split(['$date', '-']), 0]), '-', this.aggregate.arrayElemAt([this.aggregate.split(['$date', '-']), 1])]),
                'type'    : 1,
                'amount'  : 1,
                'category': 1,
            })
            .match(where)
            .group({
                _id  : {
                    'type'    : '$type',
                    'category': '$category'
                },
                total: this.aggregate.sum('$amount')
            })
            .sort({
                total: -1,
            })
            .end()
            .then((res) => {
                return res.list;
            })
            .catch((err) => {
                console.log(err);
                return false;
            })
    }

    getTotalGroupByDate(options) {
        let where = this.getWhere(options);
        return this.collection
            .aggregate()
            .project({
                'date'    : 1,
                'type'    : 1,
                'amount'  : 1,
                'category': 1,
            })
            .match(where)
            .group({
                _id  : {
                    date: '$date',
                    type: '$type'
                },
                total: this.aggregate.sum('$amount')
            })
            .sort({
                '_id.date': -1,
                '_id.type': 1
            })
            .end()
            .then((res) => {
                let result = {};
                options.date.forEach((v, i) => {
                    let date = new Date(v);
                    result[v] = {
                        'key'   : i,
                        'day'   : date.getDay(),
                        'date'  : date.getDate(),
                        'income': 0,
                        'expend': 0
                    };
                });
                if (!isEmpty(res.list)) {
                    res.list.map((v) => {
                        if (v['_id']['type'] === 0) {
                            result[v['_id']['date']].expend += v['total'];
                        } else {
                            result[v['_id']['date']].income += v['total'];
                        }
                    });
                }
                return result;
            })
            .catch((err) => {
                console.log(err);
                return false;
            });
    }

    getTotalGroupByMonth(options) {
        let where = this.getWhere(options);
        return this.collection
            .aggregate()
            .project({
                'date'    : this.aggregate.concat([this.aggregate.arrayElemAt([this.aggregate.split(['$date', '-']), 0]), '-', this.aggregate.arrayElemAt([this.aggregate.split(['$date', '-']), 1])]),
                'type'    : 1,
                'amount'  : 1,
                'category': 1,
            })
            .match(where)
            .group({
                _id  : {
                    date: '$date',
                    type: '$type'
                },
                total: this.aggregate.sum('$amount')
            })
            .sort({
                '_id.date': -1,
                '_id.type': 1
            })
            .end()
            .then((res) => {
                let result = {
                    'total': {expend: 0, income: 0},
                    'list' : {}
                };
                if (Array.isArray(options.date)) {
                    options.date.forEach((v, i) => {
                        result['list'][v] = {
                            'key'   : i,
                            'list'  : {},
                            'month' : dateFormat(v, 'n'),
                            'income': {
                                'amount'     : 0,
                                'rank'       : [],
                                'composition': [],
                            },
                            'expend': {
                                'amount'     : 0,
                                'rank'       : [],
                                'composition': [],
                            }
                        }
                    })
                }
                if (!isEmpty(res.list)) {
                    res.list.map((v) => {
                        if (v['_id']['type'] === 0) {
                            result['list'][v['_id']['date']].expend.amount += v['total'];
                            result['total']['expend'] += v['total'];
                        } else {
                            result['list'][v['_id']['date']].income.amount += v['total'];
                            result['total']['income'] += v['total'];
                        }
                    });
                }
                return result;
            })
            .catch((err) => {
                console.log(err);
                return false;
            });
    }


    getListGroupByDate(options) {
        let where = this.getWhere(options);
        return this.collection
            .aggregate()
            .project({
                date       : 1,
                category   : 1,
                type       : 1,
                amount     : 1,
                remark     : 1,
                createdTime: 1,
            })
            .match(where)
            .group({
                _id : '$date',
                list: this.aggregate.push({
                    id      : '$_id',
                    category: '$category',
                    type    : '$type',
                    remark  : '$remark',
                    date    : '$date',
                    amount  : '$amount'
                })
            })
            .sort({
                '_id': -1,
            })
            .end()
            .then((res) => {
                if (!isEmpty(res.list)) {
                    let list = {};
                    res.list.map((v) => {
                        list[v['_id']] = {
                            expend: 0,
                            income: 0,
                            list  : v.list
                        };
                        v.list.map((listVal) => {
                            if (listVal.type === 0) {
                                list[v['_id']].expend += listVal.amount;
                            } else {
                                list[v['_id']].income += listVal.amount;
                            }
                        })
                    });
                    return list;
                }
            })
            .catch((err) => {
                console.log(err);
                return false;
            });
    }

    add(data) {
        data.createdTime = this.db.serverDate();
        return this.collection
            .add({data})
            .then((res) => {
                return res['_id'];
            })
            .catch((err) => {
                console.log(err);
                return false;
            });
    }

    update(id, data) {
        data.updatedTime = this.db.serverDate();
        return this.collection
            .where({_id: id})
            .update({data})
            .then((res) => {
                return res.stats.updated >= 1;
            })
            .catch((err) => {
                console.log(err);
                return false;
            });
    }

    remove(id) {
        return this.collection.where({_id: id})
            .remove()
            .then((res) => {
                return res.stats.removed >= 1;
            }).catch((err) => {
                console.log(err);
                return false;
            });

    }
}

export default CaseNote;