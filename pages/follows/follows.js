var app = getApp()
var common = require('../../common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    similarState: true,  //匹配的状态
    similarArray: [], //进行匹配的数组
    similarValue: [],  //完成匹配的数组
    page: 1,
    nullState: false,
    options:''
  },

  bindKeyInput: function (e) {  //获取输入框数据
    var a = e.detail.value
    var b = this.data.similarArray
    var c = false
    var d = []
    var e
    if (a != "") {
      for (var i = 0; i < b.length; i++) {
        if (b[i].nickname.indexOf(a) != -1) {
          c = true
          d.push(b[i])
        }
      }
      if (d == '') {
        e = false
      } else {
        e = true
      }
    } else {
      d = b
    }
    this.setData({
      similarState: c,
      similarValue: d,
      similarState: e
    })
  },

  getData : function () {
    var that = this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/concernList',
      data: {
        id: that.data.options.id,
        size: that.data.options.num,
        page: that.data.page,
        token: app.union_id
      },
      success: function (res) {
        var a = res.data.data
        if (a == "") {
          var b = true
        } else {
          var b = false
        }
        that.setData({
          similarArray: a,
          similarValue: a,
          nullState: b
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var data = common.getFollowers(options);
    // console.log(data.nullState);
    // var that = this;
    this.setData({
      options: options
    });
    this.getData();
    // wx.request({
    //   url: 'https://zhitouapi.romawaysz.com/account/concernList',
    //   data: {
    //     id: options.id,
    //     size: options.num,
    //     page: that.data.page,
    //     token: app.union_id
    //   },
    //   success: function (res) {
    //     var a=res.data.data
    //     if(a==""){
    //       var b=true
    //     }else{
    //       var b=false
    //     }
    //     that.setData({
    //       similarArray: a,
    //       similarValue: a,
    //       nullState: b
    //     })
    //   }
    // }) 
    // this.setData({
    //   similarArray: data.similarArray,
    //   similarValue: data.similarArray,
    //   nullState: data.nullState
    // })
  },
  // 高手推荐跳转方法
  recommendJumpFun: function (e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '/pages/master/master?id=' + e.currentTarget.id
    })
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
    this.getData();
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