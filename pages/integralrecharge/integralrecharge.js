// pages/integralrecharge/integralrecharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0,
    type: 0
  },
  typeFun: function (e) {  //支付方式选择方法
    this.setData({
      type: e.currentTarget.id.substring(1)
    })
  },
  moneyFun: function (e) {  //金额选择方法
    this.setData({
      money: e.currentTarget.id.substring(1)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})