// pages/add_activity/add_activity.js
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openId: "",
        pictures: [],
    },

    add_activity: function(activity_from_wxml) {
        var that = this
        var my_release_object = activity_from_wxml.detail.value
        my_release_object["pictures"] = that.data.pictures
        my_release_object["pass"] = true
        my_release_object["publisher_openid"] = that.data.openId
        my_release_object["enroll"] = []
        console.log(my_release_object)

        //添加到总的activities活动
        db.collection('activity_table').add({
                data: my_release_object
            })
            .then(activity_from_database => {
                console.log("添加到总的activities活动")
                    // console.log(activity_from_database._id)
                my_release_object["act_id"] = activity_from_database._id
                    //添加到当前用户的已发布数组中
                db.collection("user_table")
                    .where({
                        "_openid": that.data.openId
                    })
                    .get()
                    .then(user_information => {
                        db.collection("user_table")
                            .doc(user_information.data[0]._id)
                            .update({
                                data: {
                                    my_release: _.push(my_release_object)
                                }
                            })
                            .then(res => {
                                console.log("添加到当前用户的已发布数组中")
                                wx.showToast({
                                    title: '活动添加成功，可在我的发布中查看',
                                    icon: 'success'
                                })
                            })
                    })
            })

    },

    add_pictures: function() {
        var that = this
        wx.chooseImage({
            count: 9, // 默认为9
            sizeType: ['original', 'compressed'], // 指定原图或者压缩图
            sourceType: ['album', 'camera'], // 指定图片来源
            success: function(res) {
                var tempFilePaths = res.tempFilePaths
                var tempFilePaths_length = tempFilePaths.length
                var i = 0
                var temp_array = []
                for (i = 0; i < tempFilePaths_length; i++) {
                    var p1 = wx.cloud.uploadFile({
                        cloudPath: "000" + that.data.openId + i + '.png',
                        filePath: tempFilePaths[i], // 文件路径
                        success: res => {
                            // get resource ID
                            // console.log(res.fileID)
                            temp_array.push(res.fileID)
                            that.setData({
                                pictures: temp_array
                            })

                        }
                    })
                }
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