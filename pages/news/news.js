var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottomState: true,
    notesNull:false,
    size: 10,
    navIndex: 2,
    noteNew: false,
    viewNew: false,
    otherNew: false,
    otherPage: 1,
    otherArray: [],
    maskArray: [],
    mask: false, //显示选项列表
    opt: true, //选择默认操作
    optionOne: [ //选项列表1
      { text: '所有', type: -1, state: false },
      { text: '观点', type: 1, state: false },
      { text: '笔记', type: 2, state: false },
      { text: '用户', type: 3, state: false }
    ],
    optionText: '所有',
    type : -1
  },


  setNavIndexFun: function (e) { //导航选择
    this.setData({
      navIndex: e.currentTarget.id
    })
  },
  setMaskFun:function (e) { //功能遮罩
    var a = (e.currentTarget.id.split('m'))[1]
    var b
    if (this.data.maskArray[a]){
      b=false
    }else{
      b=true
    }
    var param = {};
    var string = 'maskArray['+a+']'
    param[string] = b
    this.setData(param)
  },
  setCancelFollow:function (e) { //取消关注

  },
  setNewsTop: function (e) { //消息置顶

  },
  setNoInterest: function (e) { //不感兴趣

  },
  setShareFriend: function (e) { //分享朋友

  },
  
  bindChange : function (e) {
    var that = this;
    var type;
    var index = e.detail.value;
    if (index == 0) {
      type = -1;
    }else {
      type = index;
    }
    that.setData({
      type : type,
      optionText: that.data.optionOne[index].text,
      otherPage : 1
    })
    //that.getNoteListNewsFun();
    that.onPullDownRefresh();
  },

  getNoteListNewsFun:function(e){  //获取其他消息
    var that=this;
     var type = that.data.type;
    // 获取消息详情
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/msg/centerList',
      data: {
        type: type,
        size: that.data.size,
        page: that.data.otherPage,
        token: app.union_id
      },
      success:function(res){
        var a = res.data.data;
        console.log(a);
        if(a!=""){
          if(a.length<that.data.size){
            var c=true
          }else{
            var c=false
          }
          var b = that.data.otherArray || []
          for (var i = 0; i < a.length; i++) {
            b.push(a[i])
            var c = (b[b.length - 1].url+'').split(',')
            c = c[0] +',"sid":"'+a[i].id+'",'+c[1]
            b[b.length - 1].url = c
          }
          var d = that.data.otherPage+1;
          that.setData({
            otherArray: b,
            otherPage: d,
            bottomState: !c,
            notesNull: c
          })
        }else{
          that.setData({
            bottomState: false,
            notesNull: true
          })
        }
      }
    })
    // 获取消息总数
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/msg/unreadNum',
      data: {
        token: app.union_id
      },
      success: function(res){
        that.setData({
          otherNew: parseInt(res.data.total)
        })
      }
    })
  },
  
  linkFun: function(e){  //详情跳转方法
    var linkId = e.currentTarget.id
    var linkType = e.currentTarget.dataset.type
    var a=linkId.split(',')
    var b = a[0].split(':"')[1].split('"')[0]
    var c = a[1].split(':"')[1].split('"')[0]
    var d = a[2].split(':"')[1].split('"')[0]
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/msg/read',
      data: {
        id: c,
        token: app.union_id
      }
    })
    if (linkType==1){  //观点跳转
      wx.navigateTo({
        url: '/pages/viewdetails/viewdetails?id=' + b + '&uid=' + d
      })
    }else if (linkType==2){  //笔记跳转
      wx.navigateTo({
        url: '/pages/notedetails/notedetails?id=' + b + '&uid=' + d
      })
    } else if (linkType == 3){  //关注跳转
      wx.navigateTo({
        url: '/pages/master/master?id=' + b
      })
    }
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
      size: 10,
      navIndex: 2,
      noteNew: false,
      viewNew: false,
      otherNew: false,
      otherPage: 1,
      otherArray: [],
      maskArray: []
    })
    this.getNoteListNewsFun()
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
        otherNew: false,
        otherPage: 1,
        otherArray: []
      })
      that.getNoteListNewsFun()
      setTimeout(function () { wx.stopPullDownRefresh() }, 500)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getNoteListNewsFun()
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