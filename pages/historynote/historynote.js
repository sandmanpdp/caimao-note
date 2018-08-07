// pages/note/note.js
var app = getApp();

Page({

  /* 页面的初始数据 */
  data: {
    bottomState: true,
    notesNull: false,
    noteArray: [],  //笔记数组
    notePage: -1,  //笔记页码
    size: 10,
    reach : 3
  },
  getNoteFun: function () {  //获取我的笔记数据
    var that = this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/noteList',
      data: {
        id: app.localUserData.user_id,
        size: that.data.size,
        next: that.data.notePage,
        order: 'new',
        area: 0,
        index: that.data.notePage,
        token: app.union_id,
        is_reach: that.data.reach
      },
      success: function (res) {
        var b = res.data.data
        if (b != "") {
          if (b.length < that.data.size) {
            var d = true
          }
          var a = that.data.noteArray || []
          var c = a.length
          if (c < 0 || c==undefined) { c = 0 }
          for (var i = 0; i < b.length; i++) {
            a.push(b[i])
            a[a.length - 1]['day'] = app.getThisDay(b[i].created_at, b[i].work_date);
            a[a.length - 1]['endTime'] = app.getThisDay(res.data.time, b[i].work_date);
          }
          that.getSharePricesFun(b, function (data) {
            for (var i = 0; i < data.length; i++) {
              if (a[i].is_reach != -1) { //笔记结束
                a[c]['actualTop'] = ((a[i].out_price - a[i].in_price) / a[i].in_price * 100).toFixed(2);
              } else {
                a[c]['actualTop'] = data[i] // 笔记未结束
              }
              c++
            }
            that.setData({
              noteArray: a,
              notePage: res.data.next,
              bottomState: !d,
              notesNull: d
            })
          })
        } else {
          that.setData({
            bottomState: false,
            notesNull: true
          })
        }
      }
    })
  },
  getSharePricesFun: function (a, callback) {  //获取股票现价
    var scodeArray = []
    var priceArray = []
    for (var i = 0; i < a.length; i++) {
      scodeArray.push(a[i].scode)
      priceArray.push(a[i].in_price)
    }
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/getSharePrices?token=' + app.union_id,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        code: scodeArray
      },
      success: function (res) {
        var a = res.data.data
        var hundredArray = []
        for (var i = 0; i < priceArray.length; i++) {
          var b = parseFloat(priceArray[i])
          if (a[i] != undefined && scodeArray[i] == a[i].S_No) {
            hundredArray.push(((parseFloat(a[i].S_Price) - b) / b * 100).toFixed(2))
          } else {
            for (var r = 0; r < a.length; r++) {
              if (scodeArray[i] == a[r].S_No) {
                hundredArray.push(((parseFloat(a[r].S_Price) - b) / b * 100).toFixed(2))
              }
            }
          }
        }
        callback(hundredArray)
      }
    })
  },
  readLinkFun: function (e) {  //跳转详情页方法
    wx.setStorage({
      key: 'noteId',
      data: e.currentTarget.id,
    })
    wx.navigateTo({
      url: '/pages/notedetails/notedetails?id=' + e.currentTarget.id + '&uid=' + e.currentTarget.dataset.uid
    })
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.reach) {
      this.setData({
        reach: 1
      })
    }
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
      bottomState: true,
      notesNull: false,
      noteArray: [],  //阅读数组
      notePage: -1,  //阅读页码
    })
    this.getNoteFun()
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
      that.setData({
        bottomState: true,
        notesNull: false,
        noteArray: [],
        notePage: -1
      })
      that.getNoteFun()
      setTimeout(function () { wx.stopPullDownRefresh() }, 500)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getNoteFun()
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