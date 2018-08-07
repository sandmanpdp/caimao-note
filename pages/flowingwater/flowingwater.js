var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '全部',
    year: '',
    month: '',
    newTime: '',
    oldTime: '',
    next: -1,
    size: 10,
    nullState: false,
    moreState: false,
    array: []
  },
  bindDateChange: function (e) {
    var a = e.detail.value;
    var b = a.split('-');
    var c = b[0];
    var d = b[1];
    if (d.slice(0,1)==0){
      d = d.slice(1)
    }
    this.setData({
      date: c+'年'+d+'月',
      year: c,
      month: d,   
      next: -1,
      array: []
    })
    console.log(this.data.date)
    this.getDataFun();
  },
  getDataFun: function(){
    var that=this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/purse/detail',
      data: {
        year: that.data.year,
        month: that.data.month,
        next: that.data.next,
        size: that.data.size,
        token: app.union_id
      },
      success: function(res){
        var a=res.data.error
        var b=res.data.data
        if(a==0){
          if(b!=''){
            var c
            var d=that.data.array || []
            for(var i=0;i<b.length;i++){
              if(b.length>=that.data.size){
                c=true
              }else{
                c=false
              }
              d.push(b[i])
            }
            that.setData({
              array: d,
              nullState: !c,
              moreState: c,
              next: res.data.next
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var a = app.localUserData.created_at;
    this.setData({
      newTime: options.time,
      oldTime: a,
      year: a.slice(0,4),
      month: ''
    })
    this.getDataFun()
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
    var that = this
    success: {
      that.setData({
        next: -1,
        array: []
      })
      that.getDataFun()
      setTimeout(function () { wx.stopPullDownRefresh() }, 500)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getDataFun()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})