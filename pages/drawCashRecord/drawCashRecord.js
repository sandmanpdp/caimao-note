// pages/drawCashRecord/drawCashRecord.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '本月',
    year: '',
    month: '',
    newTime: '',
    oldTime: '',
    next: -1,
    size: 10,
    nullState: false,
    moreState: false,
    array: []
  },

  //获取提现记录数据
  getDrawCashRecord : function () {
    var that = this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/purse/detail?token=' + app.union_id,
      data : {
        size : that.data.size,
        next: that.data.next,
        pro_way : 9,
        year : that.data.year,
        month : that.data.month
      },
      success : function (res) {
        var errorCode = res.data.error;
        var resData = res.data.data;
        if (errorCode == 0) {
          if (resData != '') {
            var nullState
            var array = that.data.array || []
            for (var i = 0; i < resData.length; i++) {
              if (resData.length >= that.data.size) {
                nullState = true
              } else {
                nullState = false
              }
              array.push(b[i])
            }
            that.setData({
              array: array,
              nullState: !nullState,
              moreState: nullState,
              next: res.data.next
            })
          } else if (resData == ''){
            that.setData({
              nullState: !nullState
            })
          }
        }
      }
    })
  },
  bindDateChange: function (e) {
    var changeValue = e.detail.value
    var changeValueArr = changeValue.split('-')
    var year = changeValueArr[0]
    var month = changeValueArr[1]
    if (month.slice(0, 1) == 0) {
      month = month.slice(1)
    }
    this.setData({
      date: year + '年' + month + '月',
      year: year,
      month: month,
      next: -1,
      array: []
    })
    this.getDrawCashRecord()
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
    this.getDrawCashRecord();
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
    var a = app.localUserData.created_at
    this.setData({
      //newTime: options.time,
      oldTime: a,
      year: a.slice(0, 4),
      month: a.slice(5, 2)
    })
    this.getDrawCashRecord()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    success: {
      that.setData({
        next: -1,
        array: []
      })
      that.getDrawCashRecord()
      setTimeout(function () { wx.stopPullDownRefresh() }, 500)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getDrawCashRecord();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})