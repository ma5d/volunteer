import { showToast } from "../../utils/util.js"
const db = wx.cloud.database()
const _ = db.command
    // pages/user/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 用户信息
        userInfo: [],
        // 数据库查询参与活动跟诚信值
        num1: 0,
        num2: 100
    },

    onLoad() {
        var that = this
        var userInformation = wx.getStorageSync("userInfo")
            // console.log(userInformation)
            // console.log(userInformation.nickName)
            //avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/78fJCGJupy1YuFQibrXmfER0tkP6y6ibmNDn4kA0Sa39ZdPRV8IzrwjFGRz64rJcsvzFYkDf9bSVZ0h8s0B9uqow/132"
            // city: ""
            // country: "China"
            // gender: 1
            // language: "en"
            // nickName: "世界"
            // province: ""
        that.setData({
            userInfo: userInformation
        })
    },

    onShow() {
        //获取缓存中的 用户信息
        var that = this
        var userInformation = wx.getStorageSync("userInfo")
        console.log(userInformation.avatarUrl)
            //avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/78fJCGJupy1YuFQibrXmfER0tkP6y6ibmNDn4kA0Sa39ZdPRV8IzrwjFGRz64rJcsvzFYkDf9bSVZ0h8s0B9uqow/132"
            // city: ""
            // country: "China"
            // gender: 1
            // language: "en"
            // nickName: "世界"
            // province: ""
        that.setData({
            userInfo: userInformation
        })
    },

    //跳转到登录页面
    handleLogin() {
        wx.navigateTo({
            url: '/pages/login/index',
        });
    },

    // 提示用户 功能还没有实现
    commonToast() {
        showToast({ title: "该功能还没有实现！" });
    }

})