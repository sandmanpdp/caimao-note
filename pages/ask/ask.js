// pages/ask/ask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navIndex: 0,  //导航下标
    maskState: false  //是否显示遮罩
  },
  setNavIndexFun:function (e) { //导航选择
    this.setData({
      navIndex: (e.currentTarget.id.split('n'))[1]
    })
  },
  setMaskTrueFun: function (e) { //遮罩选择
    this.setData({
      maskState: true
    })
  },
  setMaskFalseFun: function (e) { //遮罩选择
    this.setData({
      maskState: false
    })
  },
  writeAskFun:function(){  //写问股方法
    wx.navigateTo({
      url: '/pages/askreward/askreward'
    })
  },
  detailsAskFun: function () {  //问股详情
    wx.navigateTo({
      url: '/pages/askdetails/askdetails'
    })
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