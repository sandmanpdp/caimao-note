// pages/reward/reward.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskIndex: 0, //遮罩下标
    sumIndex: 0, //金额下标
    sumValue: 10, //当前选中的金额值 
    sumOther: '其他金额', //其他金额页面显示
    sumOtherValue: 0, //其他金额值
    problemValue: null, //提问值
    sharesValue: null, //股票值
    oxValue: [], //指定牛人值
  },
  setMaskIndexFun: function (e) { //遮罩选择
    this.setData({
      maskIndex: (e.currentTarget.id.split('m'))[1]
    })
  },
  setSumIndexFun: function (e) { //悬赏金额选择
    var a = (e.currentTarget.id.split('s'))[1]
    var b
    switch(a){
      case '0':
        b=10;
        break;
      case '1':
        b=30;
        break;
      case '2':
        b=50;
        break
    }
    this.setData({
      sumIndex: a,
      sumValue: b
    })
  },
  setOtherSumFun: function (e) { //其他金额确认
    var that=this
    var a = that.data.sumOtherValue
    this.setData({
      sumIndex: 3,
      sumValue: a,
      sumOther: a + '元',
      maskIndex: 0
    })
  },
  sumOtherDateChange: function (e) { // 其他金额获取
    this.setData({
      sumOtherValue: e.detail.value
    })
  },
  problemDateChange: function (e) { // 问题获取
    this.setData({
      problemValue: e.detail.value
    })
  },
  sharesDateChange: function (e) { // 关联股票获取
    this.setData({
      sharesValue: e.detail.value
    })
  },
  oxDateChange: function (e) { // 指定牛人获取
    this.setData({
      oxValue: e.detail.value
    })
  },



  /**
   * 生命周期
   * 函数--监听页面加载
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