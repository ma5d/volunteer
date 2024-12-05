import { showToast } from "../../utils/util.js"
const db = wx.cloud.database()
const _ = db.command
    // pages/login/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    //获取用户信息
    bindGetUserUnfo(e) {
        // 获取用户信息
        var that = this
        let { userInfo } = e.detail;
        console.log(e.detail)
        wx.setStorageSync("userInfo", userInfo) //将获取到的用户信息保存到缓存中

        wx.cloud.callFunction({
            name: 'helloCloud',
            data: {
                message: 'helloCloud',
            }
        }).then(res => {
            // console.log(res.result.OPENID)
            that.setData({
                    openId: res.result.OPENID
                }) //res就将appid和openid返回了
                //做一些后续操作，不用考虑代码的异步执行问题。
            console.log(that.data.openId)

            db.collection("user_table").where({
                    _openid: that.data.openId
                })
                .get()
                .then(res4 => {
                    // console.log(res4.data[0])
                    if (res4.data.length > 0) {
                        console.log("用户已存在" + 'openId' + res4.data[0]._openid)
                        wx.setStorageSync('openId', res4.data[0]._openid)
                            // 更新头像链接地址
                        db.collection("user_table")
                            .where({
                                _openid: res4.data[0]._openid
                            }).update({
                                data: {
                                    avatarUrl: userInfo.avatarUrl
                                },
                            })
                    } else {
                        db.collection("user_table").add({
                                data: {
                                    "name": userInfo.nickName,
                                    "sex": userInfo.gender,
                                    "age": "",
                                    "profession": "",
                                    "city": userInfo.city,
                                    "telephone": "",
                                    "perference": "",
                                    "integrity_value": "",
                                    "my_publish": [],
                                    "my_application": [],
                                    "avatarUrl": userInfo.avatarUrl,
                                }
                            })
                            .then(res => {
                                console.log("用户新增成功" + 'openId' + res.data._openid)
                                wx.setStorageSync('openId', res.data._openid)
                            })

                    }

                    //返回上一页
                    wx.navigateBack({ //返回
                        delta: 1
                    })
                })
        })

    }

})