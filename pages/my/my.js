// pages/my/my.js
//获取应用实例
var app = getApp();

Page({

  /* 页面的初始数据 */
  data: {
    userInfo:[],
    commentNum:'',
    sign:'',
    userData:[ //用户数据
      {
        historyNotes: null,
        depict: '历史笔记'
      },
      {
        historyNotes: null,
        depict: '近10篇达标'
      },
      {
        historyNotes: null,
        depict: '历史收益'
      }
    ],
    changeSign : false,
    mySign:""
  },
  
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    app.globalData.scene += 1;
    app.globalData.page = true;
    //获得评论总数 by pdp
    
  },
  // 获取最新个人资料
  getNewUserInfo: function(){
    var that=this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/userInfo',
      data: {
        token: app.union_id
      },
      success:function(res){
        that.setData({
          userInfo: res.data.data
        })
        if (that.data.userInfo.sign) {
          that.setData({
            sign: that.data.userInfo.sign
          })
        } else {
          that.setData({
            sign: '编辑我的个性签名'
          })
        }
      }
    })
  },

  changeSign: function () {
    this.setData({
      changeSign : true
    }) 
  },

  cancelSign : function () {
    this.setData({
      changeSign: false
    }) 
  },

  mySign : function (e) {
    this.setData({
      mySign: e.detail.value
    })
  },

  submitSign : function () {
    var that = this;
    var mySign = that.data.mySign;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/changeBase?token=' + app.union_id,
      method:'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType:'json',
      data: {
        "type" : 0,
        "content": mySign
      },
      success : function (res) {
        console.log("个性签名"+res.data)
        if(res.data.error == '0') {
          wx.showToast({
            title: '修改成功',
          })
          that.setData({
            changeSign : false
          })
          that.getNewUserInfo(); 
        }
      }
    })
  },

  // 关注列表跳转方法
  followsLinkFun: function (e) {
    wx.navigateTo({
      url: '/pages/follows/follows?id=' + e.currentTarget.id + '&num=' + e.currentTarget.dataset.num
    })
  },
  // 历史笔记跳转方法
  linkHistoryFun:function (e) {
    wx.navigateTo({
      url: '/pages/historynote/historynote'
    })
  },

  linkReachFun: function (e) {
    wx.navigateTo({
      url: '/pages/historynote/historynote?reach=reach'
    })
  },

  // 粉丝列表跳转方法
  fansLinkFun: function (e) {
    wx.navigateTo({
      url: '/pages/fans/fans?id=' + e.currentTarget.id + '&num=' + e.currentTarget.dataset.num
    })
  },

  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {
  
  },

  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    this.getNewUserInfo()
  },

  /* 生命周期函数--监听页面隐藏 */
  onHide: function () {
  
  },

  /* 生命周期函数--监听页面卸载 */
  onUnload: function () {

  },

  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /* 页面上拉触底事件的处理函数*/
  onReachBottom: function () {
  
  },

  //  转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '黑石笔记',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  // 未开放提示
  unopenedFun: function (e) {
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000,
      mask: true
    })
  } 
})