// pages/more/more.js
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openId: "",
        current_id: ""
    },


    enroll: function() {
        var that = this
        if (!this.data.openId) {
            wx.switchTab({
                url: '/pages/mine/mine'
            })
            wx.showToast({
                title: '未登录',
                icon: ''
            })
        } else {
            // console.log(this.data.openId)
            db.collection("activity_table").doc(this.data.current_id)
                .get()
                .then(res => {
                    // console.log(res.data.publisher_openid)

                    db.collection("application_table").add({
                            data: {
                                "pass": true,
                                "applicant_openid": that.data.openId,
                                "act_id": this.data.current_id,
                                "publisher_openid": res.data.publisher_openid
                            }
                        })
                        .then(res => {
                            console.log("申请成功")
                            wx.navigateBack({
                                delta: 1
                            });
                            wx.showToast({
                                title: '申请成功',
                                icon: 'success',
                                image: '',
                                duration: 1500,
                                mask: false,
                            });
                        })
                })
        }
    },

    handleContact: function(e) {
        console.log(e.detail.path)
        console.log(e.detail.query)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            openId: wx.getStorageSync("openId")
        })
        let that = this
        console.log(options.id)
        that.setData({
            current_id: options.id
        })
        db.collection("activity_table")
            .doc(options.id)
            .get()
            .then(res => {
                that.setData({
                    more: res.data
                })
                console.log(this.data.more)
            })
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