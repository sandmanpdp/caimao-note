var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 10,
    fansNull: false,
    bottomState: true,
    fansArray: [], //粉丝信息,
    fansPage: 1,
    user_id : null
  },
  // 获取最新粉丝列表方法

  getUser : function () {
    var that = this;
   wx.request({
     url: 'https://zhitouapi.romawaysz.com/account/userInfo',
     data : {
       token : app.union_id
     },
     success : function (res){
        that.setData({
          user_id : res.data.data.id
        })
     }
   })
  },


  getFansFun: function (a) {
    var that = this
    var b = that.data.fansPage
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/fansList',
      data: {
        id: a.id,
        size: that.data.size,
        page: b,
        token: app.union_id
      },
      success: function (res) {
        var a=res.data.data
        if (a!='') {
          if(a.length<that.data.size){
            var c=true
          }else{
            var c=false
          }
          b++
          that.setData({
            fansNull: c,
            bottomState: !c,
            fansArray: res.data.data,
            fansPage: b
          })
        } else {
          that.setData({
            fansNull: true,
            bottomState: false,
          })
        }
      }
    })
  },
  followFun: function(e){  //添加关注方法
  console.log(e)
    var that=this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/Concern',
      data: {
        id: e.currentTarget.id,
        type: '1',
        token: app.union_id
      },
      success: function (res) {
        wx.showToast({
          title: '关注成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })
        var a = {}
        var b = 'fansArray[' + e.currentTarget.dataset.index +'].is_concern'
        a[b] = 1
        that.setData(a)
      }
    })
  },
  // 高手推荐跳转方法
  recommendJumpFun: function (e) {
    wx.navigateTo({
      url: '/pages/master/master?id=' + e.currentTarget.id
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser()
    app.globalData.page = true
    app.globalData.scene += 1
    this.getFansFun(options)
    
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