//获取应用实例
var app = getApp();
var getData = require('../getData/getData.js');
Page({
  data: {
    size: 10,
    hot: [], //热门笔记
    view: [], //热门观点
    recommend: [] ,//高手推荐
    authStatus: app.authStatus
  },
  //监听页面加载
  onLoad: function () {
    var that = this

    // app.getUserToken()
    
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      app.serverUserData = userInfo
      var time2=setInterval(function(){
        if (app.globalData.startState) {
          app.getserverUserData()
          clearInterval(time2)
        }
      },100)
      
    })
    
    var time = setInterval(function () {
      if (app.requestState == true) {
        setTimeout(function(){
          that.getUserData()
        },500)
        clearInterval(time)
      }
    }, 100)
    
  },

  onGotUserInfo : function (e) {
    var that = this;
    if (app.globalData.userInfo == null) {
      app.globalData.userInfo = e.detail.userInfo;
      app.authStatus = false;
      that.setData({
        authStatus: false
      })
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            
          } else {
            //调用应用实例的方法获取全局数据
            app.getUserInfo(function (userInfo) {
              //更新数据
              that.setData({
                userInfo: userInfo
              })
              app.serverUserData = userInfo
              var time2 = setInterval(function () {
                if (app.globalData.startState) {
                  app.getserverUserData()
                  clearInterval(time2)
                }
              }, 100)
            })
          }
        }
      })

      var time = setInterval(function () {
        if (app.requestState == true) {
          setTimeout(function () {
            that.getUserData()
          }, 500)
          clearInterval(time)
        }
      }, 100)
    }
  },

  denyAuth : function () {
    this.setData({
      authStatus : false
    })
  },

  getUserData:function(){
    var that = this
    // 热门笔记请求
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/noteList',
      data: {
        next: '-1',
        order: 'hot',
        index: '-1',
        area: 0,
        size: that.data.size,
        token: app.union_id
      },
      success: function (res) {
        if(res.data.error==0){
          var a = []
          var b = res.data.data
          if(b!=''){
            for (var i = 0; i < 3 && i < b.length; i++) {
              a.push(b[i])
              a[i]['day'] = app.getThisDay(b[i].created_at, b[i].work_date)
            }
            that.setData({
              hot: a
            })
          }
        }
      }
    })
    // 热门观点请求
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/view/list',
      data: {
        page: 1,
        size: that.data.size,
        token: app.union_id
      },
      success: function (res) {
        if(res.data.error==0){
          var a = []
          var b = res.data.data
          if(b!=''){
            for (var i = 0; i < 3 && i < b.length; i++) {
              a.push(b[i])
            }
            console.log(a)
            that.setData({
              view: a
            })
            
          }
        }
      }
    })
    //高手推荐请求
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/hotUserList',
      data: {
        user_id: app.localUserData.user_id,
        token: app.union_id,
        order : 'increase'
      },
      success: function (res) {
        if(res.data.error==0){
          var a = [];
          var b = res.data.data
          if(b!=''){
            for (var i = 0; i < 3 && i < b.length; i++) {
              if (b[i].id == app.localUserData.user_id) {
                if (b[3]) {
                  a.push(b[3])
                }
              } else {
                a.push(b[i])
              }
            }
            that.setData({
              recommend: a
            })
          }
        }
      }
    })
    
  },
  //当前页面下拉刷新
  onPullDownRefresh: function () {
    var that = this 
    success:{
      that.getUserData()
      setTimeout(function(){wx.stopPullDownRefresh()},500)
    }
    // getData.getUserInfo({ token: app.union_id },function (res) {
    //   console.log('##############');
    //   console.log(res)
    // })
  },
  //购买方法
  buyFun: function (e) {
    var that = this
    wx.request({
      url: "https://zhitouapi.romawaysz.com/note/createRead",
      data:{
        sId: e.currentTarget.id,
        type: 2,
        token: app.union_id
      },
      success:function(res){
        console.log(res)
        if (res.data.error==0){
          wx.navigateTo({
            url: '/pages/notedetails/notedetails?id=' + e.currentTarget.id + '&uid=' + e.currentTarget.dataset.uid
          })
        }else{
          wx.navigateTo({
            url: '/pages/notebuy/notebuy?id=' + e.currentTarget.id + '&uid=' + e.currentTarget.dataset.uid
          })
        }
      }
    })
  },
  // 笔记阅读方法
  noteReadFun: function(e){
    wx.navigateTo({
      url: '/pages/notedetails/notedetails?id=' + e.currentTarget.id + '&uid=' + e.currentTarget.dataset.uid
    })
  },
  // 问股诊股方法
  askFun: function (e) {
    wx.navigateTo({
      url: '/pages/ask/ask'
    })
  },
  // 观点阅读方法
  viewReadFun: function (e) {
    wx.navigateTo({
      url: '/pages/viewdetails/viewdetails?id=' + e.currentTarget.id
    })
  },
  // 高手推荐跳转方法
  recommendJumpFun: function (e){
    wx.navigateTo({
      url: '/pages/master/master?id=' + e.currentTarget.id
    })
  },
  // 未开放提示
  unopenedFun: function (e) {
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000,
      mask: true
    })
  },
  // 生命周期函数--监听页面显示
  onShow: function () {
    var that = this;
    if (app.globalData.scene == 0) {
      app.globalData.scene = 1
      that.onLoad
    }
    if (app.globalData.page == true){
    //   console.log('刷新执行了');
      that.getUserData()
    }

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) { //未授权
          that.setData({
            authStatus: true
          })
          // wx.navigateTo({
          //   url: '/pages/authPage/authPage',
          // })
        }else {
          that.setData({
            authStatus: false
          })
        }
      }
    })
  
  },
  // 生命周期函数--监听页面隐藏
  onHide: function () {
    app.globalData.scene -= 1;
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
      imageUrl:'../images/shareImg.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  } 
})
