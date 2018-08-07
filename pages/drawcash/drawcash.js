// pages/drawcash.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cash : 0,
    remainDemond : 0,
    demond : 0,
    score : 0
  },
  //提现值
  cashNum : function (e) {
    var that = this;
    var cash = e.detail.value
    that.setData({
      cash: cash
    })
    that.setData({
      remainDemond: cash / 40  - that.data.demond
    }) 
  },
  //获取余额

  getDemond : function () {
    var that = this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/purse/index',
      data: {
        token: app.union_id
      },
      success : function (res) {
        var resData = res.data.data;
        var score = resData.score;
        var demond = resData.score / 2;
        that.setData({
          demond : demond,
          score : score
        })
      }
    })
  },

  // 提现 
  drawCash : function () {
    var that = this;
    var now = new Date();
    var day = now.getDate();
    console.log(day);
    if (that.data.cash <100) {
      wx.showToast({
        title: '单笔最低100元',
      })
    } else if(day < 25) {
      wx.showToast({
        title: '25日后才可提现',
      })
    } else if (that.data.score < that.data.cash * 40) {
      wx.showToast({
        title: '钻石不足',
      })
    }else {
      wx.request({
        url: 'https://zhitouapi.romawaysz.com/purse/forCash?token=' + app.union_id,
        data: {
          score: that.data.cash * 40
        },
        success: function (res) {
          console.log(res.data.error);
          if (res.data.error == 0) {
            wx.showToast({
              title: '提现成功',
            })
          }
        }
      })
    }
  },

  drawCashRules : function () {
    wx.navigateTo({
      url: '/pages/drawCashRules/drawCashRules',
    })
  },
  drawCashRecord : function () {
    wx.navigateTo({
      url: '/pages/drawCashRecord/drawCashRecord',
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
    this.getDemond()
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