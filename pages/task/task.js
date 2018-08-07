var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: false,
    number: 0
  },
  
  //签到方法
  signFun: function(e,z){
    var that=this
    var a = {token: app.union_id}
    if(z){
      a['check'] = 1
    }
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/activity/sign',
      data: a,
      success: function(res){
        var b = res.data.error
        if(z){
          if (b == 10400) {
            that.setData({
              state: true
            })
          } else if (b == 0) {
            that.setData({
              state: false
            })
          }
        }
        if(!z){
          if(b==0){
            wx.showToast({
              title: '签到成功,获得'+ that.data.number +'积分',
              icon: 'none',
              duration: 2000,
              mask: true,
              success: function(){
                that.setData({
                  state: true
                })
              }
            })
          }else{
            wx.showToast({
              title: b,
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }
        }
      }
    })
  },
  getNumber: function(){
    var that=this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/product/caseMsg',
      data:{
        id: 1,
        token: app.union_id
      },
      success: function(res){
        if(res.data.error==0){
          that.setData({
            number: parseInt(res.data.data.price)
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.signFun(true,true)
    this.getNumber()
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