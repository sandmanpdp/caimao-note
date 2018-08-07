// pages/note/note.js
var app = getApp();

Page({

  /* 页面的初始数据 */
  data: {
    bottomState: true,
    notesNull: false,
    navIndex: true, //导航下标
    readArray: [],  //阅读数组
    readPage: -1,  //阅读页码
    noteArray: [],  //阅读数组
    notePage: -1,  //阅读页码 
    size: 10
  },
  setNavIndexFun: function (e) { //导航下标设置
    var a
    if (e.currentTarget.id == '0') {
      a = true
      this.getReadFun()
    } else {
      a = false
      this.getNoteFun()
    }
    this.setData({
      navIndex: a,
      bottomState: true,
      notesNull: false
    })
  },
  getReadFun: function () {  //获取我的阅读数据
    var that = this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/lookList',
      data: {
        next: that.data.readPage,
        size: that.data.size,
        token: app.union_id
      },
      success: function (res) {
        console.log(res)
        var b = res.data.data
        if (b != "") {
          if (b.length < that.data.size) {
            var d = true
          }
          var a = that.data.readArray || []
          var c = a.length - 1
          if (c < 0) { c = 0 }
      
          that.getSharePricesFun(b, function (data) {
    
            for (var i = 0; i < data.length; i++) {
              a.push(data[i])
              a[a.length - 1]['day'] = app.getThisDay(data[i].created_at, data[i].work_date)
            }

            that.setData({
              readArray: a,
              readPage: res.data.next,
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
        token: app.union_id
      },
      success: function (res) {
        var b = res.data.data
        if (b != "") {
          if (b.length < that.data.size) {
            var d = true
          }
          var a = that.data.noteArray || []
          var c = a.length
          if (c < 0 || c == undefined) { c = 0 }
          // for (var i = 0; i < b.length; i++) {
          //   a.push(b[i])
          //   a[a.length - 1]['day'] = app.getThisDay(b[i].created_at, b[i].work_date)
          //   a[a.length - 1]['endTime'] = app.getThisDay(res.data.time, b[i].work_date)
          // }

          that.getSharePricesFun(b, function (data) {
            for (var i = 0; i < data.length; i++) {
              a.push(data[i])
              a[a.length - 1]['day'] = app.getThisDay(data[i].created_at, data[i].work_date);
              a[a.length - 1]['endTime'] = app.getThisDay(res.data.time, b[i].work_date);
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

    var scodeArray = [];
    var priceArray = [];
    for (var i = 0; i < a.length; i++) {
      scodeArray.push(a[i].scode)

    }

    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/getSharePrices?token=' + app.union_id,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        code: scodeArray
      },
      success: function (res) {
        var price_data = res.data.data;
        var hundredArray = [];
      
        for (var i in a) 
        {
          var in_price = parseFloat(a[i]['in_price'])
          var now_price=0;
          
          if (a[i]['is_reach']!=-1)  //结束
          {
            now_price = ((parseFloat(a[i].out_price) - in_price) / in_price * 100).toFixed(2); 
          }
          else
          {
            for (var r in price_data) 
            {
              if (price_data[r] != undefined && price_data[r]['S_No'] == a[i].scode) {
                now_price = ((parseFloat(price_data[r]['S_Price']) - in_price) / in_price * 100).toFixed(2); //笔记未结束 & 笔记结束
                break;
              }
            }
          }

    
          a[i]['actualTop'] = now_price;
        
          hundredArray[scodeArray[i]]=now_price;

          // else {
          //   for (var r = 0; r < a.length; r++) {
          //     if (scodeArray[i] == a[r].S_No) {
          //       hundredArray.push(((parseFloat(a[r].S_Price) - b) / b * 100).toFixed(2))
          //     }
          //   }
          // }
        }
        callback(a)
      }
    })
  },


  readLinkFun: function (e) {  //我的跳转详情页方法
    console.log("e.currentTarget.id is " + e.currentTarget.id);
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
      //navIndex: true, //导航下标
      readArray: [],  //阅读数组
      readPage: -1,  //阅读页码
      noteArray: [],  //阅读数组
      notePage: -1,  //阅读页码
    })
    this.getNoteFun();
    this.getReadFun();
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
        readArray: [],
        readPage: -1,
        noteArray: [],
        notePage: -1
      })
      if (that.data.navIndex) {
        that.getReadFun()
      } else {
        that.getNoteFun()
      }
      setTimeout(function () { wx.stopPullDownRefresh() }, 500)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.navIndex) {
      this.getReadFun()
    } else {
      this.getNoteFun()
    }
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