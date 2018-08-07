var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    array: [],
    type: 0,
    price:"",
    addValue:0
  },
  typeFun: function(e){  //支付方式选择方法
    this.setData({
      type: e.currentTarget.id.substring(1)
    })
  },
  moneyFun: function (e) {  //金额选择方法
    // this.setData({
    //   id: e.currentTarget.id
    // })
    console.log(e);
    var array = this.data.array;
    var id = e.currentTarget.id;
    for(var i = 0;i<this.data.array.length;i++){
      if(id == i) {
        this.data.array[i].isSelected = true;
      }else {
        this.data.array[i].isSelected = false;
      }
    }
    // 清除输入框的值
    this.setData({
      price:'',
      addValue: e.currentTarget.dataset.money
    })
    this.setData(this.data);
  },
  getFun: function(){  //支付
    var that=this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/pay/wxOrder',
      data: {
        openid: app.globalData.openid,
        // case: that.data.id,
        price: that.data.addValue,
        token: app.union_id
      },
      success: function(res){
        var a=res.data.error
        if(a==0){
          var b=res.data.data
          wx.requestPayment({
            'timeStamp': b.timeStamp+'',
            'nonceStr': b.nonceStr,
            'package': b.package,
            'signType': b.signType,
            'paySign': b.paySign,
            'success': function (res) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000,
                mask: true
              })
              wx.redirectTo({
                url: '../wallet/wallet'
              })
            },
            'fail': function (res) {
            }
          })
        }else{
          wx.showToast({
            title: a+'',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      }
    })
  },

  //保存input的值
  savePrice: function (e) {
    this.setData({
      price: e.detail.value,
      addValue: e.detail.value
    })
  },

  getMoney:function(){  //获取充值金额
    this.setData({
      array:[
        {"top":"充6元","bottom":"得20积分","money":"6","isSelected":false},
        { "top": "充30元", "bottom": "得600积分", "money": "30", "isSelected": false},
        { "top": "充98元", "bottom": "得1960积分", "money": "98", "isSelected": false },
        { "top": "充298元", "bottom": "得5960积分", "money": "298", "isSelected": false },
        { "top": "充588元", "bottom": "得11760积分", "money": "588", "isSelected": false },
        { "top": "充998元", "bottom": "得19960积分", "money": "998", "isSelected": false },
        { "top": "充1598元", "bottom": "得31960积分", "money": "1598", "isSelected": false },
        { "top": "充5998元", "bottom": "得119960积分", "money": "5998", "isSelected": false },
        { "top": "充9998元", "bottom": "得199960积分", "money": "9998", "isSelected": false }
        ]
    })
  },
  //选择其他金额 清除已选中金额
  otherMoneyFocus:function () {
    for (var i = 0; i < this.data.array.length; i++) {
      this.data.array[i].isSelected = false;
    }
    this.setData(this.data);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMoney()
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