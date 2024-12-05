//index.js
const app = getApp();
var page = 1;
const db = wx.cloud.database()
const _ = db.command
Page({
    data: {
        bannerUrls: [ //轮播图的图片
            {
                url: '/images/p1.jpeg',
                linkUrl: ''
            },
            {
                url: '/images/p2.jpeg',
                linkUrl: ''
            },
            {
                url: '/images/p3.jpeg',
                linkUrl: ''
            }
        ],
        imgheights: '',
        recommend: [],
        count: 0,
    },

    onLoad: function() {
        var that = this;
        that.imageLoad();
        var that = this
        this.setData({
                openId: wx.getStorageSync("openId")
            })
            //是否登录
        if (!that.data.openId) {
            wx.switchTab({
                url: '/pages/mine/mine'
            })
        }
    },

    toback: function() { wx.navigateTo({ url: '/pages/background/background' }) },
    tocomu: function() { wx.navigateTo({ url: '/pages/comment/comment' }) },
    toguide: function() { wx.navigateTo({ url: '/pages/guide/guide' }) },
    imageLoad: function() {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                //我们设计图片的尺寸是750*388
                var width = res.windowWidth; //获取当前屏幕的宽度
                var rao = 1024 / width; //图片宽度／屏幕的宽度
                var height = 400 / rao; //图片高度／比例
                that.setData({
                    'imgheights': height //设置等比缩放的宽度
                })
            },
        })
    },
    activity_more: function(events) {
        // console.log('/pages/more/more?id=' + events.currentTarget.id)
        wx.navigateTo({
            url: '/pages/more/more?id=' + events.currentTarget.id
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this
        db.collection("activity_table").where({
                act_type: _.in(["宣传教育", "环境保护"])
            })
            .get()
            .then(res => {
                this.setData({
                    recommend: res.data
                })
            })
    },

    onReachBottom: function() {
        let that = this
        var tempcount = that.data.count + 1
        that.setData({
            count: tempcount
        })

        const promise = db.collection('activity_table')
            .where({
                act_type: _.in(["宣传教育", "环境保护"])
            })
            .skip(tempcount * 20)
            .limit(20)
            .get()
        promise.then(res => {
            var new_array = this.data.recommend
            var new_array_length = res.data.length
            var i = 0
            let that = this
            for (i = 0; i < new_array_length; i++) {
                new_array.push(res.data[i])
            }
            that.setData({
                recommend: new_array
            })
            console.log(new_array)
        })


    }

});