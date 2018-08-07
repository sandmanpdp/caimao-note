var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    masterArray: [],
    sortArray: ['累计收益', '近10篇达标率'],
    sortBy: 0,
  },
  //添加关注方法
  followFun: function(e){
    var that=this
    app.masterFollowFun(e.currentTarget.id,this)
    setTimeout(function(){
      that.setData({
        masterArray: []
      })
      that.getMasterListFun()
    },500)
    
  },
  //获取数据方法
  getMasterListFun: function(){
    var that = this;
    var index = that.data.sortBy;
    var way;
    if (index==0) {
      way = 'increase'
    }else {
      way = 'reach'
    }
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/hotUserList',
      data: {
        order: way,
        token: app.union_id
      },
      success: function (res) {
        var a = res.data.data
        var b = that.data.masterArray || []
        for(var i=0;i<a.length;i++){
          if (a[i].id != app.localUserData.user_id){
            b.push(a[i])
          }
        }
        that.setData({
          masterArray: b
        });
      } 
    })
  },
  //达人主页
  linkFun: function(e){
    wx.navigateTo({
      url: '/pages/master/master?id=' + e.currentTarget.id
    })
  },
  //排序规则 

  sortFun : function (e) {
    this.setData({
      sortBy: e.detail.value
    })
    this.onPullDownRefresh()
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
    this.setData({
      masterArray: []
    })
    this.getMasterListFun()
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

  //当前页面下拉刷新
  onPullDownRefresh: function () {
    var that = this
    success: {
      // that.setData({
      //   masterArray: []
      // })
      that.data.masterArray = []
      that.getMasterListFun()
      setTimeout(function () { wx.stopPullDownRefresh() }, 500)
    }
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