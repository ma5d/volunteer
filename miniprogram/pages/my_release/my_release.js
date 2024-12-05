// pages/my_release/my_release.js
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        my_release: {}
    },



    add_activity: function() {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        this.setData({
            openId: wx.getStorageSync("openId")
        })
        console.log(this.data.openId)
        db.collection("first-users").where({
                "_openid": this.data.openId
            })
            .get()
            .then(user_information => {
                // if (res.data[0].my_relea) {
                //     console.log("you")
                // } else {
                //     console.log("wu")
                // }
                console.log(user_information.data[0].my_release)
                // console.log(user_information)
                that.setData({
                        my_release: user_information.data[0].my_release
                    })
                    // db.collection("first")
                    //     .doc(user_information.data[0].my_release[0])
                    //     .get()
                    //     .then(my_release_data => {
                    //         console.log(my_release_data.data)
                    //         that.setData({
                    //             my_release_activities: my_release_data.data
                    //         })
                    //     })
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