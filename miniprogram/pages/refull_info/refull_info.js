// pages/bdxx/bdxx.js
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openId: "",
    },

    submit: function(e) {
        var that = this
            // console.log(e.detail.value)
        var unsave = e.detail.value
        if (unsave.name == "") {
            wx.showToast({
                title: '请输入的姓名',
                icon: 'error'
            })
        }
        if (unsave.city == "") {
            wx.showToast({
                title: '请输入的您所在的城市',
                icon: 'error'
            })
        }
        if (unsave.phonenub.length != 11) {
            wx.showToast({
                title: '无效的手机号',
                icon: 'error'
            })
        }

        if (unsave.name != "" && unsave.city != "" && unsave.phonenub.length == 11) {
            // console.log(unsave)
            db.collection('user_table').where({
                    _openid: that.data.openId
                })
                .get()
                .then(res => {
                    // console.log(res.data[0])
                    db.collection('user_table').doc(res.data[0]._id).update({
                            // data 传入需要局部更新的数据
                            data: {
                                // 表示将 done 字段置为 true
                                age: unsave.age,
                                sex: unsave.gender,
                                name: unsave.name,
                                profession: unsave.occupation,
                                telephone: unsave.phonenub,
                                preference: unsave.qinxiang,

                            }
                        })
                        .then(res => {
                            wx.showToast({
                                title: '更改信息成功',
                                icon: 'success'
                            })
                        })
                })

        }




    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        this.setData({
            openId: wx.getStorageSync("openId")
        })
        console.log(that.data)
            //是否登录
        if (that.data.openId == "") {
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