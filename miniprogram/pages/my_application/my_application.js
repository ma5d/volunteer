// pages/my_application/my_application.js
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        application: []
    },

    delete_applicant: function(e) {
        var that = this
        wx.showActionSheet({
            itemList: ['删除申请', '继续申请'],
            success: function(res) {
                if (res.tapIndex == 0) {
                    console.log(e.currentTarget.id)
                    db.collection("application_table").doc(e.currentTarget.id)
                        .remove({
                            success: function(res) {
                                // console.log(res.data)
                                that.onShow()
                            }
                        })
                }
            },
            fail: function(res) {
                console.log(res.errMsg)
            }
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
        db.collection("application_table")
            .where({
                "applicant_openid": this.data.openId
            })
            .get()
            .then(res => {
                var data_length = res.data.length
                if (data_length != 0) {
                    var i = 0
                    var applicated = []

                    function store_application(i) {
                        if (i == data_length) return;
                        db.collection('activity_table').doc(res.data[i].act_id).get({
                            success(res2) {
                                res2.data["application_id"] = res.data[i]._id
                                applicated.push(res2.data)
                                store_application(i + 1)
                                that.setData({
                                    application: applicated
                                })
                                console.log(that.data.application)
                            }
                        })
                    }
                    store_application(0)
                } else {
                    that.setData({
                        application: []
                    })
                }
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