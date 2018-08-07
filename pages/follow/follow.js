// pages/follow/follow.js
var app = getApp();
var f = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasIt: false,
    author: [] //作者信息
  },
  // 取消关注方法
  followClearFun: function (e) {
    var that = this
    var id = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '是否取消关注',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://zhitouapi.romawaysz.com/account/Concern',
            data: {
              user_id: app.localUserData.user_id,
              force_id: id,
              type: '0',
              token: app.union_id
            },
            success: function (res) {
              var a=[]
              if (that.data.author.length > 1){
                for (var i = 0; i < that.data.author.length; i++) {
                  if (i != e.target.dataset.index) {
                    a.push(that.data.author[i])
                  }
                }
                console.log(a);
                that.setData({
                  hasIt: true,
                  author: a
                })
              }else{
                that.setData({
                  hasIt: false,
                  author: a
                })
              }
              
            },
            fail: function (err) { //请求失败
              wx.showToast({
                title: '取消失败',
                icon: 'success',
                duration: 1000,
                mask: true
              })
            },
            complete: function () { //请求完成后执行的函数
              
            }
          });
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  // 获取最新关注方法
  getUserFollow: function (){
    var that = this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/concernList',
      data: {
        id: app.localUserData.user_id,
        size: 20,
        page: '1',
        token: app.union_id
      },
      success: function (res) {
        if (res.data.data) {
          // console.log(res.data.xy.item)
          that.setData({
            hasIt: true,
            author: res.data.data
          })
        }else{
          that.setData({
            hasIt: false
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    app.globalData.page = true
    app.globalData.scene += 1
    this.getUserFollow()
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
    this.getUserFollow()
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