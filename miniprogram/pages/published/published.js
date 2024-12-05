// pages/published/published.js
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openId: "",
        published: [],
    },


    activity_more: function() {
        wx.navigateTo({
            url: '/pages/manage_activity/manage_activity'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        this.setData({
                openId: wx.getStorageSync("openId")
            })
            //是否登录
        if (!that.data.openId) {
            wx.navigateTo({
                url: '/pages/mine/mine'
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this
        db.collection("user_table")
            .where({
                "_openid": that.data.openId
            })
            .get()
            .then(res => {
                // console.log(res)
                that.setData({
                    published: res.data[0].my_release
                })
                console.log(that.data.published)
            })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})