//获取应用实例

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    notesNull: false,
    bottomState: true,
    size: 10,
    viewArray: [],  //观点数组
    viewPage: 1 , //页码
    comments:[],
    sortArray :['热度','最新'],
    sortBy : 0
  },
  viewReadFun: function (e) {// 观点阅读方法
    wx.navigateTo({
      url: '/pages/viewdetails/viewdetails?id=' + e.currentTarget.id
    })
  },
  sortFun: function (e) {
    this.setData({
      sortBy: e.detail.value
    })
    this.onPullDownRefresh()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListFun(options.id)
    if (options.id){
      this.setData({
        id: options.id
      })
    }
  },

  getListFun:function(q){
    var that = this;
    var order;
    if (that.data.sortBy==0) {
      order = 'hot'
    }else {
      order= 'new'
    }
    if (q) {
      var a = {
        id: q,
        size: that.data.size,
        page: that.data.viewPage,
        token: app.union_id,
        order: order
      }
    } else {
      var a = {
        size: that.data.size,
        page: that.data.viewPage,
        token: app.union_id,
        order : order
      }
    }
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/view/list',
      data: a,
      success: function (res) {
        var b = res.data.data;
        
        if (b != "") {
          if (b.length < that.data.size) {
            var c = true
          } else {
            var c = false
          }
          var d= that.data.viewArray || []
          for(var i=0;i<b.length;i++){
            d.push(b[i])
          }
          
          //获取每个观点（b数组）comment的数量 by pdp
          for (var j = 0; j < b.length; j++) {
            var commentTotals = 0,
                lookTotals = 0,
                praiseTotals = 0;
                console.log(b[j]);
            commentTotals = commentTotals + parseInt(b[j].comment);
            console.log(commentTotals);
            // wx.setStorageSync("commentId"+b[j].id, b[j].comment);
            // wx.getStorage({
            //   key: "commentId" + b[j].id,
            //   success: function (res) {
            //     console.log(res.data);
            //   },
            // })
          }
          

          that.setData({
            viewArray: d,
            viewPage: res.data.page,
            notesNull: c,
            bottomState: !c,
          })
        } else {
          that.setData({
            notesNull: true,
            bottomState: false,
          })
        }
      }
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
      //   notesNull: false,
      //   bottomState: true,
      //   viewArray: [],
      //   viewPage: -1
      // })
      that.data.viewArray = []
      that.data.viewPage = 1;
      that.data.notesNull = false;
      that.data.bottomState = true;
      if(that.data.id){
        that.getListFun(that.data.id)
      }else {
        that.getListFun()
      }
      
      setTimeout(function () { wx.stopPullDownRefresh() }, 500)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getListFun(this.data.id)
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