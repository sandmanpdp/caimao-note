// pages/drawCashRules/drawCashRules.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    drawCashRules: null,
    unionId : null,
    src:null
  },

  //提现规则和记录
  drawCashData: function () {
    //var that = this;
    // wx.request({
    //   url: 'https://zhitouapi.romawaysz.com/help/detail?token=' + app.union_id,
    //   data: {
    //     id: 6
    //   },
    //   success: function (res) {
    //     console.log(res.data);
    //     var initdrawCashRules = '';
    //     initdrawCashRules = res.data.data.content.replace(/<p>/g, '').replace(/<\/p>/g, '');
    //     that.setData({
    //       drawCashRules: initdrawCashRules
    //     })
    //   }
    // })
    this.setData({
      src: 'https://zhitouapi.romawaysz.com/help/detail?token=' + app.union_id + '&id=6'
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
    this.drawCashData()
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})