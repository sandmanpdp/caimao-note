var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    walletArray: [],
    moneyArray: [],
    integralArray: [],
    time: '',
    noReadValue: true,
    identityAuthFalse : '',
    noIdentityAuth : '',
    userInfo : '',
    is_very : ''
  },


  // 获取数据
  getWalletFun: function(e){
    var that = this
    // 账户数据请求
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/purse/index',
      data: {
        token: app.union_id
      },
      success: function (res) {
        var a=res.data.data
        var b=[]
        for (var i = 0; i < a.remain_freeze_type.length;i++){
          b.push(a.remain_freeze_type[i])
          if (a.remain_freeze_type[i].pro_type==1){
            b[b.length - 1]['text'] ='冻结阅读费：'
          } else if (a.remain_freeze_type[i].pro_type == 2) {
            b[b.length - 1]['text'] = '笔记押金：'
          }
        }
        var c = []
        for (var i = 0; i < a.score_freeze_type.length; i++) {
          c.push(a.score_freeze_type[i])
          if (a.score_freeze_type[i].pro_type == 1) {
            c[c.length - 1]['text'] = '阅读费：'
          } else if (a.score_freeze_type[i].pro_type == 2) {
            c[c.length - 1]['text'] = '笔记押金：'
          }
        }
        if (a.score_freeze_type.length == 0) {
          that.setData({
            noReadValue : false
          })
        }
        that.setData({
          walletArray: a,
          moneyArray: b,
          integralArray: c,
          time: res.data.time
        })
        console.log(that.data.walletArray);
      }
    })
  },
  //充值跳转方法
  rechargeFun:function(e){
    wx.navigateTo({
      url: '/pages/recharge/recharge',
    })
  },
  // 积分规则跳转方法
  integralruleLinkFun: function (e) {
    wx.navigateTo({
      url: '/pages/integralrule/integralrule'
    })
  },
  // 积分商城跳转方法
  mallLinkFun: function (e) {
    wx.navigateTo({
      url: '/pages/integral/integral'
    })
  },
  // 流水明细跳转方法
  flowingWaterLinkFun: function (e) {
    wx.navigateTo({
      url: '/pages/flowingwater/flowingwater?time='+ this.data.time
    })
  },

  // 提现跳转
  drawCash:function () {
    wx.navigateTo({
      url: '/pages/drawcash/drawcash',
    })
  },

  //实名验证
  idenAuth: function () {
    wx.navigateTo({
      url: '/pages/phone/phone?type=identiyAuthDrawcash',
    })
  },


  TestidenAuth: function () {
    wx.navigateTo({
      url: '/pages/identityAuth/identityAuth?type=identiyAuthDrawcash',
    })
  },

  valueMarket: function () {
    wx.navigateTo({
      url: '/pages/market/market',
    })
  },

  // 疑问跳页
  problem : function () {
    wx.navigateTo({
      url: '/pages/scoreProblem/scoreProblem'
    })
  },

  //提现按钮的业务逻辑

  drawCashBtn: function () {
    var that = this;
    var is_very = that.data.is_very;  // is_very  ==  -1 未提交认证 、 0 待审核 、1已通过 、2已拒绝
    if (is_very == 1) {
      that.drawCash();
    } else if (is_very == -1) {
      that.setData({
        identityAuthFalse : false,
        noIdentityAuth: true,
      })
    } else if (is_very == 0) {
      wx.navigateTo({
        url: '/pages/authSuccess/authSuccess',
      })
    } else if (is_very == 2){
      that.setData({
        identityAuthFalse: true,
        noIdentityAuth: false,
      })
    }
  },

  closeBtn : function () {
    this.setData({
      noIdentityAuth : false
    })
  },

  // 获取最新个人资料
  getNewUserInfo: function () {
    var that = this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/userInfo',
      data: {
        token: app.union_id
      },
      success: function (res) {
        that.setData({
          userInfo: res.data.data,
          is_very: res.data.data.is_very
        })
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWalletFun();
    this.getNewUserInfo()
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
    this.getWalletFun();
    this.setData({
      identityAuthFalse: false,
      noIdentityAuth: false,
    });
    this.getNewUserInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      identityAuthFalse: false,
      noIdentityAuth: false,
    });
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
  },
  // 未开放提示
  unopenedFun: function (e) {
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000,
      mask: true
    })
  }
})