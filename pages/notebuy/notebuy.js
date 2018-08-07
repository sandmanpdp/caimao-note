//获取应用实例
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskCueState: false,  //是否显示支付遮罩
    id: null,  //笔记id
    uid: null,  //用户id
    vip: true,  //等级
    myid: null,  //我的id
    followState: null,  //关注状态
    sign : '',
    
    userInfo: [],  //用户信息
    noteInfo: [],  //笔记信息
    priceArray: [1, 0, 0],  //渲染价格图片的数组
    code: null,  //股票代码
    targetDay: null,  //目标时间
    endDay: null,  //截止时间
    relatedView: null,
    isRelatedView: false,
    readInfo: null, //阅读数据
    profitNum: 0,
    profitInfo: null,//收益数据
    moreProfitInfo: false,
    readState: false,  //是否省略显示阅读头像

  },
  masterFollowFun: function (e) {  // 关注用户方法
    app.masterFollowFun(e.currentTarget.id, this)
  },
  openCueMaskFun: function (e) {  //打开支付遮罩
    this.setData({
      maskCueState: true
    })
  },
  closeCueMaskFun: function (e) {  //关闭支付遮罩
    this.setData({
      maskCueState: false
    })
  },

  linkReadUserPage: function () {
    wx.navigateTo({
      url: '/pages/readUserPage/readUserPage?id=' + this.data.id,
    })
  },

  linkRewardUserPage: function () {
    wx.navigateTo({
      url: '/pages/profitPage/profitPage?pro_type=2&id=' + this.data.id
    })
  },
  linkUserFun: function (e) {  //跳转达人主页
    wx.navigateTo({
      url: '/pages/master/master?id=' + e.currentTarget.id
    })
  },

  //到达人主页
  toMasterPage: function () {
    wx.navigateTo({
      url: '/pages/master/master?id=' + this.data.uid
    })
  },

  fansLinkFun: function (e) {  // 粉丝列表跳转方法
    wx.navigateTo({
      url: '/pages/fans/fans?id=' + e.currentTarget.id
    })
  },

  buyFun: function (e) {  //购买笔记
    var that = this
    wx.request({
      url: "https://zhitouapi.romawaysz.com/note/createRead",
      data: {
        sId: e.currentTarget.id,
        type: 2,
        token: app.union_id
      },
      success: function (res) {
        if (res.data.error == 0) {
          that.setData({
            buyState: true
          });
          wx.redirectTo({
            url: '/pages/notedetails/notedetails?id=' + that.data.id + '&uid=' + that.data.uid
          })
        } else if (res.data.error == 10080) {
          wx.showToast({
            title: '余额不足',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else if (res.data.error == 10092) {
          wx.showToast({
            title: '超过阅读人数限制',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else {
          wx.showToast({
            title: res.data.error,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      }
    })
  },

  //获取关联观点的内容
  getRelatedView: function () {
    var that = this;
    var id = that.data.id;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/linkNoteView?token=' + app.union_id,
      data: {
        note_id: id
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.data.length > 0) {
          console.log("关联观点内容" + res.data.data)
          that.setData({
            relatedView: res.data.data,
            isRelatedView: true
          })
        }
      }
    })
  },

  //关联观点 详情
  relatedViewDetail: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/viewdetails/viewdetails?id=' + id,
    })
  },

  /**
    * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      uid: options.uid
    })

    wx: wx.request({  //获取用户数据
      url: 'https://zhitouapi.romawaysz.com/account/otherUserInfo',
      data: {
        id: options.uid,
        token: app.union_id
      },
      success: function (res) {
        var a
        if (res.data.data.is_concern == 0) {
          a = false
        } else {
          a = true
        }
        that.setData({
          id: options.id,
          uid: options.uid,
          myid: app.localUserData.user_id,
          userInfo: res.data.data,
          followState: a
        })
        if (that.data.userInfo.sign) {
          that.setData({
            sign: that.data.userInfo.sign
          })
        } else {
          that.setData({
            sign: '这个人很懒，什么都没有留下'
          })
        }
      }
    })
    wx: wx.request({  //获取笔记数据
      url: 'https://zhitouapi.romawaysz.com/note/detail',
      data: {
        id: options.id,
        token: app.union_id
      },
      success: function (res) {
        console.log(res)
        var a = res.data.data
        var b = a.need_price.split('')
        var c = a.code.substring(0, 3) + '***'
        var e = app.getThisDay(res.data.time, a.limit_date)
        if (e <= 0) {
          e = 0
        }

        if (a.limit_date == '2038-01-01 00:00:00') {
          var f = '不限制阅读时间'
        } else if (app.getThisDay(res.data.time, a.limit_date) <= 0) {
          var f = '订阅时间已截止'
        } else {
          var f = app.getThisDay(res.data.time, a.limit_date) + '天后不能订阅'
        }
        
        that.setData({
          noteInfo: a,
          priceArray: b,
          code: c,
          targetDay: e,
          endDay: f
        })
      }
    })
    wx: wx.request({  //获取笔记阅读数据
      url: 'https://zhitouapi.romawaysz.com/note/noteLookList',
      data: {
        id: options.id,
        next: -1,
        token: app.union_id
      },
      success: function (res) {
        var a = res.data.data
        var b = []
        for (var i = 0; i < a.length && i < 9; i++) {
          b.push(a[i])
        }
        var c
        if (a.length < 7) {
          c = false
        } else {
          c = true
        }
        that.setData({
          readInfo: b,
          readState: c
        })
      }
    })
      // 获得打赏列表
    wx:wx.request({
      url: 'https://zhitouapi.romawaysz.com/purse/detail',
      data: {
        size: 7,
        next: -1,
        token: app.union_id,
        pro_id: options.id,
        pro_way: 6,
        sum: 1,
        pro_type : 2
      },
      success: function (res) {
        console.log(res.data.data)

        var moreProfitInfo = false;
        if (res.data.data.length > 7) {
          moreProfitInfo = true;
        } else {
          moreProfitInfo = false
        }
        that.setData({
          profitInfo: res.data.data,
          moreProfitInfo: moreProfitInfo,
          profitNum: res.data.total
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getRelatedView();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getRelatedView();
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