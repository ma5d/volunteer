
// pages/comment/comment.js
// import {comments} from '../../../data/data'
// import {itPost} from '../../../item/item-post'
import {getDiffTime, login, randomString} from '../../utils/util'
var app = getApp(); 
/*
const origin_style = {
  'style':'background-color: #EAE8E8;',
  'longTap':false,
};
const changed_style = {
  'style':'background-color: #A5D9EE;',
  'longTap':true,
}
*/
// todo:动画的位置直接去了1200px，这是ipad pro的尺寸
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    emojiStatus:false,
    keyboardInput:"",
    keyboardStatus:false,
    postStatus:false,
    userInfo:"",
    storageKeyName:"comments",
    moreDeleteStatus:false,
    //留言板的位置和大小调整，使初始化不出错
    commentStyle:"height: 0px; bottom:-1200px;",
    txtBottom:"bottom: -1200px;",
    //comment_style:origin_style,
  },

  /**获取用户信息**/
  onGetUserInfo:function(e){
    login(this);
    // console.log(userInfo);
    
  },

  /*
    页面函数
  */

  /*
  用于评论框的变蓝进行设定，但做的还不好，看wxml
  longTapDelete:function(){
    this.setData({
      comment_style:changed_style
    })
  },

  longTapReturn:function(){
    this.setData({
      comment_style:origin_style
    })
  },
  */
  //setData 以及获取最新的页面高度
  setHeight:function(id){
    var key = id||"#mainPage"
    var that = this;
    var query = wx.createSelectorQuery();
    query.select(key).boundingClientRect();
    query.exec(function(rect){
      if(rect[0] === null){
        console.log("Cannot get the main height, id is "+key)
      }
      else{
        console.log("Get the page(height,width...) property successfully");//观察数据
        //console.log(rect[0])
        if(rect[0].height<1200)rect[0].height=1200; // 1200 is ipad pro inch 
        that.setData({
          uploadHeight:rect[0].height,
          txtHeight:"height:"+rect[0].height+"px; ",
          txtBottom:"bottom:-"+rect[0].height+"px; ",
          commentStyle:"bottom:-"+rect[0].height+"px; "+"height:"+parseInt(that.windowHeight*0.7)+"px;"
        });
      }
    })
    
 
    // query自动保存了boundingClientRect执行后的参数,作为形参可自动传入exec
  },

  /*********更多选择************/
  //点击“更多”拉起更多选择
  up_moreFunction:function(event){
    var idx = event.currentTarget.dataset.moreIdx;
    var lidx = null||event.currentTarget.dataset.lIdx;
    var userID = this.data.userOpenId;
    const cStatus = this.data.comments[idx].openID==userID
    const lStatus = this.data.comments[idx].leaveMessage[lidx] && this.data.comments[idx].leaveMessage[lidx].openID
    if(cStatus||lStatus){
      this.setData({
        moreDeleteStatus:true,
      })
    }else{
      this.setData({
        moreDeleteStatus:false,
      })
    }
    this.moreFunctionAnimation.translateY(-this.data.uploadHeight).step();
    this.setData({
      moreMessage: this.data.comments[idx].username+":"+this.data.comments[idx].content.txt,
      moreIdx:idx,
      lIdx: lidx,
      moreFunctionAnimation:this.moreFunctionAnimation.export(),
      keyboardInput:"",
      keyboardStatus:false,
      postStatus:!this.data.postStatus,
      moreStatus:true,
    });
  },
  
  //“更多中的”点赞功能实现
  moreFunction_up:function(event){
    var idx = this.data.moreIdx;
    var lIdx = this.data.lIdx
    console.log("comment id is "+idx);
    var res = this.comment_post.upUpdate(idx, lIdx, this.userOpenId);
    this.setData({
      comments:res
    });
    this.translateYDown();
    if(res[idx].upInfo.upStatus){
      wx.showToast({
        title: '点赞成功',
        duration: 800,
        icon: "success"
      })
  }else{
    wx.showToast({
      title: '点赞取消',
      duration: 800,
      icon: "none"
    })
  }
  },
  
  //"更多中的"删除功能实现
  moreFunction_delete:function(event){
    var idx = this.data.moreIdx;
    var lIdx = this.data.lIdx;
    const ipx = this.data.comments[idx]._id
    console.log(`_id is ${ipx} id is ${idx}`)
    if(typeof(lIdx)=="number"){
      this.data.comments[idx].leaveMessage.splice(lIdx, 1)
    }else{
      this.data.comments.splice(idx, 1)
    }
    //删除评论采用更新数据的方法，删除整个回复使用remove方法
    this.comment_post.deleteBase(this.idx, lIdx, ipx, this.data.comments[idx].leaveMessage);
    this.setData({
      comments:this.data.comments
    })
    wx.setStorageSync('comments', this.data.comments)
    wx.showToast({
      title: '删除成功',
      icon: "success",
      duration: 1000
    })
    this.translateYDown();
  },

  //"更多中的"留言功能实现
  moreFunction_leave:function(){
    this.translateYDown()
    this.translateYUp()
    this.setData({
      sendStatus:false,
      moreIdx:this.data.moreIdx,
    })
  },
  /*************end***************/

  /*************输入框部分**********/
  //实现模块上下移动
  translateSendUp:function(){
    this.translateYUp()
    this.setData({
      sendStatus:true,
    })
  },
  
  translateLeaveUp:function(event){
    this.translateYUp()
    this.setData({
      sendStatus:false,
      moreIdx:event.currentTarget.dataset.moreIdx,
    })
  },

  translateYDown:function(){
    if(!this.data.moreStatus){
      this.animation.translateY(0).step();
      this.setData({
        animation:this.animation.export(),
        keyboardInput:"",
        keyboardStatus:false,
        postStatus:!this.data.postStatus
      });
    }else{
      this.moreFunctionAnimation.translateY(0).step();
      this.setData({
        moreFunctionAnimation:this.moreFunctionAnimation.export(),
        keyboardInput:"",
        keyboardStatus:false,
        postStatus:!this.data.postStatus
      });
    }
  },

  translateYUp:function(){
    //console.log("进行向上移动")
    this.animation.translateY(-this.data.uploadHeight).step();
    this.setData({
      moreStatus:false,
      animation:this.animation.export(),
      postStatus:!this.data.postStatus
    });
  },

  // 实现对用户的回复
  leaveMoreMsg: function(){
    //订阅信息权限的提供
    wx.requestSubscribeMessage({
      tmplIds: ['B27muzDePKEo3UvIhgiV_Uv8ISFtWsmmJ1LgDt_hPOg'],
      success(res){console.log( "订阅消息授权成功")},
      fail(e){
        console.log("授权失败")
        console.log(`errMsg is ${e.errMsg}, errCode is ${e.errCode}`)
      }
    })
    var res = this.data.keyboardInput;
    var time = parseInt(new Date()/1000);
    var that = this.data.userInfo;
    var idx = this.data.moreIdx;
    const id = this.data.comments[idx]._id;
    var post = {
      "openID":this.data.userOpenId,
      "ownerId":id,
      "username":that.nickName,
      "comment":res,
      "time":time,
      "upInfo":{
        "upNum":0,
        "upStatus":false,
        "upUserList":[]
      }
    } ;

    //数据库的更新
    res = this.comment_post.updateLeaveStorage(post, idx, id, this.idx);

    //页面的重新渲染
    console.log(post);
    this.setData({
      keyboardInput:"",
      comments:res
    })
    this.setHeight();
    wx.showToast({
      title: '评论成功',
      icon: "success",
      duration: 1000
    })
    this.translateYDown();

    //消息的推送
    this.comment_post.push2client(post, res[idx], this.idx, true)
  },

  // 实现信息的发送以及数据库的更新
  sendMoreMsg: function(){
    //订阅信息权限的提供
    wx.requestSubscribeMessage({
      tmplIds: ['B27muzDePKEo3UvIhgiV_Uv8ISFtWsmmJ1LgDt_hPOg'],
      success(res){console.log( "订阅消息授权成功")},
      fail(e){
        console.log("授权失败")
        console.log(`errMsg is ${e.errMsg}, errCode is ${e.errCode}`)
      }
    })

    var res = this.data.keyboardInput;
    var time = parseInt(new Date()/1000);
    var that = this.data.userInfo;
    var post = {
      "_id":randomString(),
      "username":that.nickName,
      "openID":this.userOpenId,
      "avatar":that.avatarUrl,
      "create_time":time,
      "formatedDate": getDiffTime(time, true),
      "content":{txt:res},
      "upInfo":{
        "upNum":0,
        "upStatus":false,
        "upUserList":[]
      },
      "leaveMessage":[]
    } ;

    console.log(post);
    res = this.comment_post.updateCommentStorage(post, this.idx);
    this.setData({
      keyboardInput:"",
      comments:res
    })
    this.setHeight();
    
    wx.showToast({
      title: '评论成功',
      icon: "success",
      duration: 1000
    })
    this.translateYDown();
    this.comment_post.push2client(post, res, this.idx, false)
  },

  bindCommentInput: function(event){
    var res = event.detail.value;
    // console.log(res);
    this.data.keyboardInput = res;
    if(res != ""){
    this.setData({
      keyboardStatus:true,
      SEND:true&&this.data.sendStatus,
      LEAVE:true&&!this.data.sendStatus
    })
    }else{
      this.setData({
        keyboardStatus:false,
        SEND:false&&this.data.sendStatus,
        LEAVE:false&&!this.data.sendStatus
      })
    }
  },
  /**************end***************/

  // 点赞功能的实现
  setUp: function(event){
    var idx = event.currentTarget.dataset.commentIdx;
    var lIdx;
    console.log("comment id is "+idx);
    var res = this.comment_post.upUpdate(idx, lIdx, this.userOpenId);
    this.setData({
      comments:res
    });
  },
  
  lSetUp: function(event){
    var idx = event.currentTarget.dataset.commentIdx;
    var lIdx = event.currentTarget.dataset.lIdx
    console.log("comment id is "+idx+" lidx is "+lIdx);
    var res = this.comment_post.upUpdate(idx, lIdx, this.userOpenId);
    this.setData({
      comments:res
    });
  
  },

  //进行评论与用户信息的初始化
  initInfo: async function(e){
    // 评论数据初始化
    await this.comment_post.commentFromCloud(e.idx, this);
    //获取用户信息
    // await login(this);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    class itPost{
      constructor(){
        this.storageKeyName = 'comments';
      }
    
      //实现点赞功能，点赞或者取消。更新缓存数据，返回最新的缓存数据
      upUpdate(idx, lIdx, openId){
        var res = this._getCommentStorage();
        if(typeof(lIdx)=="number"){
          console.log(`id is ${idx} lIdx is ${lIdx} res is ${res[idx].leaveMessage[lIdx].upInfo}`)
          if(res[idx].leaveMessage[lIdx].upInfo.upStatus){
            // 取消点赞
            res[idx].leaveMessage[lIdx].upInfo.upNum--;
            const index = res[idx].leaveMessage[lIdx].upInfo.upUserList.indexOf(openId)
            if(index>-1){
              res[idx].leaveMessage[lIdx].upInfo.upUserList.splice(index, 1)
              console.log("取消点赞成功")
            }else{
              console.log(`取消点赞失败 index is ${index} openId is ${openId} upList is ${res[idx].leaveMessage[lIdx].upInfo.upUserList}`)
            }
          }else{
            res[idx].leaveMessage[lIdx].upInfo.upNum++;
            res[idx].leaveMessage[lIdx].upInfo.upUserList.unshift(openId)
          }
          res[idx].leaveMessage[lIdx].upInfo.upStatus = !res[idx].leaveMessage[lIdx].upInfo.upStatus;
        }else{
        if(res[idx].upInfo.upStatus){
          // 取消点赞
          res[idx].upInfo.upNum--;
          const index = res[idx].upInfo.upUserList.indexOf(openId)
          if(index>-1){
            res[idx].upInfo.upUserList.splice(index, 1)
            console.log("取消点赞成功")
          }else{
            console.log(`取消点赞失败 index is ${index} openId is ${openId} upList is ${res[idx].upInfo.upUserList}`)
          }
        }else{
          res[idx].upInfo.upNum++;
          res[idx].upInfo.upUserList.unshift(openId)
        }
        res[idx].upInfo.upStatus = !res[idx].upInfo.upStatus;
        }
        wx.setStorageSync(this.storageKeyName, res);
        return res
      }
    
      // 对于时间先后的排序，最新的在前
      compareDate(data){
        //冒泡排序法两两比较
        var t = null;
        for(let idx_i=0;idx_i<data.length;idx_i++){
          for(let idx_j=0;idx_j<data.length-idx_i-1;idx_j++){
            if(data[idx_j].create_time<data[idx_j+1].create_time){
              t = data[idx_j];
              data[idx_j] = data[idx_j+1]
              data[idx_j+1] = t;
            }
          }
        }
        return data
      }
    
      //缓存添加评论
      updateCommentStorage(data, idx, key){
        //保存用户的点赞列表，不是很优雅的获取了AppID
        if(!this.openId){
          this.openId = wx.getStorageSync('userOpenId')
        }
        // data.upUserList.unshift(this.openId)
    
        key = key||this.storageKeyName;
        // console.log("key name is"+key);
        // 保存在当地数据
        var res = this._getCommentStorage(key);
        // 在置顶后添加数据
        res.splice(1,0,data);
        wx.setStorageSync(key, res);
        this.updateBase(idx, [data]);
        //console.log("update comments is "+ [data])
        return res
      }
    
      updateLeaveStorage(data, idx, ownerId, dIdx, key){
        var res = this._getCommentStorage(key);
        key = key||this.storageKeyName;
        res[idx].leaveMessage.push(data)
        wx.cloud.callFunction({
          name:"leaveComment",
          data:{
            LM:res[idx].leaveMessage,
            ownerId:ownerId,
            idx:dIdx,
          }
        }).then(res=>{
          console.log("Database leave meassage successfully.")
        }).catch(e=>{
          console.error;
          throw e;
        })
        wx.setStorageSync(key, res)
        return res 
      }
    
      //将留言推送给这个模版下的所有用户
      push2client(post, comment, idx, from_comment){
        function unique(arr){
          return Array.from(new Set(arr))
        }
        // 主留言板的推送，只推送给自己
        if(!from_comment){
          wx.cloud.callFunction({
            name:"push2client",
            data:{
              idx:idx,
              usrname:post.username,
              txt:post.content.txt,
              time:getDiffTime(post.create_time, false, true),
              from_comment:from_comment
            }
          })
        }
        // 评论里的推送
        else{
        const client = []
        const openID = post.openID;
        if(comment.openID!=openID)client.push(comment.openID);
        for(let i=0;i<comment.leaveMessage.length;i++){
          const lm = comment.leaveMessage[i];
          if(lm.openID!=openID)client.push(lm.openID);
        }
        wx.cloud.callFunction({
          name:"push2client",
          data:{
            idx:idx,
            idList:unique(client),
            usrname:post.username,
            txt:post.comment,
            time:getDiffTime(post.time, false, true),
            from_comment:from_comment
          }
        })}
      }
    
      //update
      _getCommentStorage(key){
        // use syny method
        // use this.data.data to update storage
        // 从本地缓存中获取信息
        key = key||this.storageKeyName;
        // 若没有，则调用云数据库进行数据的读取
        return wx.getStorageSync(key)
      }
    
      // 从数据库读取信息
      // 要不要添加环境参数？
      async commentFromCloud(idx, cWindow){
        // 因为cm是then和catch是异步编程，因此在这里去获得缓存是不正确的
        var that = this;
        const t0 = new Date().getTime()
        try{
          wx.cloud.callFunction({
              name:"getComment",
              data:{
                idx:idx
              },
              success: function(res){
                
                // console.log("comments data is "+res.result.data)
                // 调用getComment占用了接近90%的时间
                //const t1_0 = new Date().getTime();
                //console.log("cloud function consume: "+(t1_0-t0)/1000)
                // 循环比较时间基本不占用时间
                var data = that.compareDate(res.result.data);
                for(let idx=0;idx<data.length;idx++){
                  data[idx].formatedDate = getDiffTime(data[idx].create_time, true);
                }
                //const t1_1 = new Date().getTime();
                //console.log("for loop consumes: "+(t1_1-t1_0)/1000)
                wx.setStorageSync(that.storageKeyName, data)
                const t1 = new Date().getTime();
                console.log(`init0: Successfully Load database data from comments-${idx}, time consume(from t0):${(t1-t0)/1000}`);
                login(cWindow)
              },
              fail: function(res){
                const initData = [{
                  _id:randomString(),
                  description:"Oringinal Response",
                  avatar:'/images/userAvatar.jpg',
                  openID:"Hello World",
                  artIdx:idx,
                  content:{
                    audio:null,
                    img:[],
                    txt:"告诉我你在想什么，想告诉我们什么吧."
                  },
                  upInfo:{
                    upUserList:[],
                    upNum:0,
                    upStatus:false,
                  },
                  create_time:1628555309, //时间对应于2021年，在未来进行更新
                  username:'饼子屋',
                  leaveMessage:[],
                }]
                console.log("initially set storage")
                wx.setStorageSync(that.storageKeyName, initData)
                login(cWindow)
                wx.cloud.callFunction({
                name:"initComment",
                data:{
                  idx:idx,
                  initData:initData
                },
                success: function(res){
                  console.log("Successfully init database comments-"+idx);
                },
                fail:console.error
              })
             },
             //实现用户未登录时的数据加载：实现防止保存缓存早于创建新的数据库集合，第119行
              complete: function(res){
                wx.getSetting({
                  success(res){
                    if(!res.authSetting['scope.userInfo']){
                    console.log("unlogin setData")
                    var comments = wx.getStorageSync('comments');
                    cWindow.setData({
                      comments:comments
                    })
                    cWindow.setHeight();
                  }
                  }
                })
                const t2 = new Date().getTime();
                console.log(`init0: Complete process, time consume(from t0):${(t2-t0)/1000}`);
              },
          })
        }catch(e){
          console.log("itPost commentFromCloud failed");
          throw e;
        }
      }
    
      // 更新数据库信息(主评论的添加)
      updateBase(idx, data, key){
        key = key||this.storageKeyName;
        //console.log("data is "+ data)
        const new_data = data || wx.getStorageSync(key)
        wx.cloud.callFunction({
          name:"updateComment",
          data:{
            newdata:new_data,
            idx:idx
          },
        }).then(res=>{
          console.log("Database updated successfully.")
        }).catch(e=>{
          console.error;
          throw e;
        })
      }
    
      // 删除数据库信息
      deleteBase(idx, lIdx, ipx, data, key){
        key = key||this.storageKeyName;
        wx.cloud.callFunction({
          name:"deleteComment",
          data:{
            ipx:ipx,
            idx:idx,
            lIdx:lIdx,
            res:data,
          }
        }).then(res=>{
          console.log("Database has deleted one comment")
        }).catch(e=>{
          throw e;
        })
      }
      
      // 更新点赞
      updateUp(idx, data, key){
        key = this.storageKeyName||key
        const comments = data||wx.getStorageSync(key)
        wx.cloud.callFunction({
          name:"updateUp",
          data:{
            comments:comments,
            idx:idx
          }
        }).then(res=>{
          console.log("Up num updated successfully")
        }).catch(e=>{
          throw e;
        })
      }
    
    
      // 云更新集合(点赞以及信息) 
      /*
      async updateCloud(idx, key){
        await this.updateBase(idx, key);
        await this.updateUp(idx, key);
      }*/
    }


    // 清空本地缓存，加载最新的消息
    wx.clearStorageSync();
    // 设置idx，在卸载页面中使用到
    this.idx = options.idx
    //设置留言框的高度
    this.windowHeight = wx.getSystemInfoSync().windowHeight;
    console.log("the windowHeight is "+this.windowHeight)
   
    // itPost是数据相关的类
    this.comment_post = new itPost();
    this.initInfo(options)

    // 判断是否得到用户信息
    var user = wx.getStorageSync('userInfo');
    if(!user){
      this.setData({
        userStatus:false
      })
    }else{
      this.setData({
        userStatus:true,
        userInfo:user
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 用于留言框的动画
    this.animation = wx.createAnimation({
      duration:250,
      timingFunction:"linear"
    });

    // 用于更多功能点击的动画
    this.moreFunctionAnimation = wx.createAnimation({
      duration:250,
      timingFunction:"linear"
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //this.comment_post.updateCloud(this.idx)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // this.comment_post.updateCloud(this.idx);
    this.comment_post.updateUp(this.idx)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})


/*
  getEmoji: function(event){
    var emojiStatus = this.data.emojiStatus;
    this.setData({
      emojiStatus:!emojiStatus
    });
  },

  getKeyboard: function(event){
    console.log("Get in the getKeyboard function")
    var emojiStatus = this.data.emojiStatus;
    console.log(emojiStatus)
    this.setData({
      emojiStatus:!emojiStatus
    });
  },
*/