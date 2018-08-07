// pages/set/set.js
var app = getApp();
console.log(app.local)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identiyAuth : "identiyAuth",
    bindPhone: "bindPhone",
    is_very : ''
  },
  oneFun: function () {
    wx.navigateTo({
      url: '/pages/phone/phone?type=' + this.data.bindPhone
    })
  },
  twoFun: function () {
    wx.navigateTo({
      url: '/pages/push/push'
    })
  },
  threeFun: function () {
    wx.navigateTo({
      url: '/pages/phone/phone?type=' + this.data.identiyAuth
    })
  },
  addAddress : function () {
    wx.navigateTo({
      url: '/pages/myAddress/myAddress',
    })
  },

  // 获取最新个人资料
  getNewUserInfo: function () {
    var that = this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/userInfo',
      data: {
        token: app.union_id
      },
      success: function (res) {
        that.setData({
          is_very: res.data.data.is_very
        })
      }
    })
  },

  authBtn: function () {
    var that = this;
    var is_very = that.data.is_very;  // is_very  ==  -1 未提交认证 、 0 待审核 、1已通过 、2已拒绝
    if (is_very == 0){
      wx.navigateTo({
        url: '/pages/authSuccess/authSuccess',
      })
    }else {
      wx.navigateTo({
        url: '/pages/phone/phone?type=' + this.data.identiyAuth
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getNewUserInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
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
  } 
})