const db = wx.cloud.database()
const _ = db.command
Page({
    data: {
        that: {},

        act_name_array: ["不限", "抗疫宣传员", "环境清洁工", "禁毒宣传员", "义务植树者", "马拉松比赛服务人员", "留守儿童临时看护", "小广告志愿督察", "文明劝导队员"],
        act_type_array: ["不限", "宣传教育", "环境保护", "文体娱乐", "扶贫帮困"],
        begin_time_array: ["不限", "2021-3-21", "2021-7-22", "2021-6-26", "2021-3-12", "2021-4-11", "2021-5-28", "2021-3-19", "2021-5-9"],
        finish_time_array: ["不限", "2021-3-21", "2021-7-22", "2021-6-26", "2021-3-12", "2021-4-11", "2021-5-28", "2021-3-19", "2021-5-9"],
        need_number_array: ["不限", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        position_array: ["不限", "安徽省淮南市", "安徽省合肥市"],

        act_name_index: 0,
        act_type_index: 0,
        begin_time_index: 0,
        finish_time_index: 0,
        need_number_index: 0,
        position_index: 0,

        changed_array: [],
        no_limit_choose: {},
        count: 0,
    },

    act_name_change: function(e) {
        // console.log(this.data.need_number_array[e.detail.value])
        this.setData({
            act_name_index: e.detail.value
        })
    },

    act_type_change: function(e) {
        // console.log(this.data.act_type_array[e.detail.value])
        this.setData({
            act_type_index: e.detail.value
        })
    },

    begin_time_change: function(e) {
        // console.log(this.data.begin_time_array[e.detail.value])
        this.setData({
            begin_time_index: e.detail.value
        })
    },

    finish_time_change: function(e) {
        // console.log(this.data.finish_time_array[e.detail.value])
        this.setData({
            finish_time_index: e.detail.value
        })
    },

    need_number_change: function(e) {
        // console.log(this.data.need_number_array[e.detail.value])
        this.setData({
            need_number_index: e.detail.value
        })
    },

    position_change: function(e) {
        // console.log(this.data.position_array[e.detail.value])
        this.setData({
            position_index: e.detail.value
        })
    },

    submit: function() {
        var that = this
        if (this.data.act_name_index != 0) {
            this.data.no_limit_choose["act_name"] = this.data.act_time_array[this.data.act_name_index]
        } else {
            delete this.data.no_limit_choose["act_name"]
        }

        if (this.data.act_type_index != 0) {
            this.data.no_limit_choose["act_type"] = this.data.act_type_array[this.data.act_type_index]
        } else {
            delete this.data.no_limit_choose["act_type"]
        }

        if (this.data.begin_time_index != 0) {
            this.data.no_limit_choose["begin_time"] = this.data.begin_time_array[this.data.begin_time_index]
        } else {
            delete this.data.no_limit_choose["begin_time"]
        }

        if (this.data.finish_time_index != 0) {
            this.data.no_limit_choose["finish_time"] = this.data.finish_time_array[this.data.finish_time_index]
        } else {
            delete this.data.no_limit_choose["finish_time"]
        }

        if (this.data.need_number_index != 0) {
            this.data.no_limit_choose["need_number"] = this.data.need_number_array[this.data.need_number_index]
        } else {
            delete this.data.no_limit_choose["need_number"]
        }

        if (this.data.position_index != 0) {
            this.data.no_limit_choose["position"] = this.data.position_array[this.data.position_index]
        } else {
            delete this.data.no_limit_choose["position"]
        }
        // console.log(this.data.no_limit_choose)

        var p1 = db.collection("activity_table")
            .where(this.data.no_limit_choose)
            .get()
        p1.then(res => {
            this.setData({
                changed_array: res.data
            })
            console.log(res.data)
        })

        // 异步
        // var PromiseArr = [p1];
        // var result = PromiseArr.map(promise =>
        //     promise.then((res) => ({ status: 'ok', res }), (err) => ({ status: 'not ok', err }))
        // )
        // Promise.all(result)
        // .then(
        //     res => {
        //         if (PromiseArr.length == res.length) {
        //             // coding here
        //             console.log("changed_array")
        //             console.log(that.data.changed_array)
        //         }
        //     }
        // )

    },

    onLoad: function(options) {
        //Do some initialize when page load.

    },

    activity_more: function(events) {
        console.log('/pages/more/more?id=' + events.currentTarget.id)
        wx.navigateTo({
            url: '../more/more?id=' + events.currentTarget.id
        })
    },

    onReady: function() {
        //Do some when page ready.

    },
    onShow: function() {
        //Do some when page show.

    },
    onHide: function() {
        //Do some when page hide.

    },
    onUnload: function() {
        //Do some when page unload.

    },
    onPullDownRefresh: function() {
        //Do some when page pull down.

    },

    onReachBottom: function() {
        let that = this
        var tempcount = that.data.count + 1
        that.setData({
            count: tempcount
        })
        console.log(that.data.count)
            // db.collection("first")
            //     .where(this.data.no_limit_choose)
            //     .get()
            //     .then(res => {
            //         var i = 0
            //         var res_data_length = res.data.length
            //         console.log("for start1")
            //         for (i = 0; i < res_data_length; i++) {
            //             // console.log(res.data[i])
            //             this.data.changed_array.push(res.data[i])
            //         }
            //         console.log(this.data.changed_array)

        //     })

        const promise = db.collection('activity_table').skip(tempcount * 20).limit(20).get()
        promise.then(res => {
            var new_array = this.data.changed_array
            var new_array_length = res.data.length
            var i = 0
            let that = this
            for (i = 0; i < new_array_length; i++) {
                new_array.push(res.data[i])
            }
            that.setData({
                changed_array: new_array
            })
            console.log(new_array)
        })


    }
})