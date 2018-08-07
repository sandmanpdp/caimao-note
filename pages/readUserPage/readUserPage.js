// pages/readUserPage/readUserPage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    readUsers: '',
    next: -1,
    hasMoreUsers: true
  },

  getReader: function () {
    var that = this;
    var readUsersArray = that.data.readUsers || []
    wx.request({  //获取笔记阅读数据
      url: 'https://zhitouapi.romawaysz.com/note/noteLookList',
      data: {
        id: that.data.id,
        next: that.data.next,
        token: app.union_id
      },
      success: function (res) {
        console.log(res.data.data)
        var resData = res.data.data
        var hasMoreUsers = that.data.hasMoreUsers;
        
        if (resData != '') {
          for (var i = 0; i < resData.length; i++) {
            readUsersArray.push(resData[i]);
          }
          if (resData.length >= 70) {
            hasMoreUsers = true;
          } else {
            hasMoreUsers = false;
          }
          that.setData({
            readUsers: readUsersArray,
            next: res.data.next,
            hasMoreUsers: hasMoreUsers
          })
          
        }else {
          that.setData({
            hasMoreUsers: false
          })
        }
        
      }
    })
  },

  loadMore : function () {
    this.getReader();
  },


  linkUserFun: function (e) {  //跳转达人主页
    wx.navigateTo({
      url: '/pages/master/master?id=' + e.currentTarget.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })

    this.getReader()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getReader();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})