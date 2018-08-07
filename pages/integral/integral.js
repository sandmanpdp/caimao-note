// pages/integral/integral.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskState: false
  },
  //打开遮罩的方法
  openMaskFun: function () {
    this.setData({
      maskState: true
    })
  },
  //关闭遮罩的方法
  endMaskFun: function(){
    this.setData({
      maskState: false
    })
  },
  //积分充值跳转方法
  rechargeFun: function (e) {
    wx.navigateTo({
      url: '/pages/integralrecharge/integralrecharge',
    })
  },
  //积分乐园跳转方法
  parkFun: function (e) {
    wx.navigateTo({
      url: '/pages/park/park',
    })
  },
  //积分兑换跳转方法
  shoppingFun: function (e) {
    wx.navigateTo({
      url: '/pages/shopping/shopping',
    })
  },
  //收货地址跳转方法
  addressFun: function (e) {
    wx.navigateTo({
      url: '/pages/address/address',
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