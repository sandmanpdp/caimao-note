// pages/profitPage/profitPage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    profitInfo : null,
    next : -1,
    nullState : false,
    selfData : null,
    userName: app.localUserData.nickname,
    userAvatar: app.localUserData.avatar,
    user_id: app.localUserData.user_id,
    pro_type : 1,
  },

  getProfit : function () {
    var that = this;
    var profitInfoArray = that.data.profitInfo || [];
    var nullState = false;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/purse/detail',
      data: {
        size: 10,
        next: that.data.next,
        token: app.union_id,
        pro_id: that.data.id,
        pro_way: 6,
        sum :1,
        pro_type: that.data.pro_type,
        order : "price"
      },
      success: function (res) {
        var resData = res.data.data;
        console.log(res.data.data)
        if (resData != '') {
          for (var i = 0; i < resData.length; i++) {
            profitInfoArray.push(resData[i]);
          }
          if (resData.length >= 10){
            nullState = true;
          }else {
            nullState = false;
          }

          that.setData({
            profitInfo: profitInfoArray,
            next: res.data.next,
            nullState: nullState,
            selfData : res.data.self,
            userName: app.localUserData.nickname,
            userAvatar: app.localUserData.avatar,
            user_id: app.localUserData.user_id
          })
          if (that.data.selfData) {
            that.setData({
              userName: app.localUserData.nickname,
              userAvatar: app.localUserData.avatar,
              user_id: app.localUserData.user_id
            })
          }
        
        }
      }
    })
  },
  
  


  toMasterPage: function (e) {
    wx.navigateTo({
      url: '/pages/master/master?id=' + e.currentTarget.dataset.uid
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      pro_type : options.pro_type
    }) 
    this.getProfit()
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
    var that = this
    success: {
      that.setData({
        next: -1,
        profitInfo: []
      })
      that.getProfit()
      setTimeout(function () { wx.stopPullDownRefresh() }, 500)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getProfit()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})