App({
  serverUserData: '',
  localUserData: '',
  requestState: false,
  union_id: '',
  authStatus : false,
  onLaunch: function () {
    var that=this;
    //未授权跳页
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '/pages/authPage/authPage',
          })
        } else {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      }
    })


    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      
    })
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    //保持登陆状态
    that.ping()
  },
  //onLaunch生命周期结束

  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          if (wx.getStorageSync('union_id') != '' && wx.getStorageSync('openid') != ''){
            that.union_id = wx.getStorageSync('union_id')
            that.globalData.openid = wx.getStorageSync('openid')
            that.globalData.startState = true
            console.log(that.union_id + '：本地缓存unionID')
            console.log(that.globalData.openid + '：本地缓存openid')
            console.log('执行序列：1-缓存')
          }else{
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://zhitouapi.romawaysz.com/account/wxUnionid?code=' + res.code + '&token=' + that.localToken,
                data: {},
                success: function (res) {
                  that.union_id = res.data.unionid || res.data.openid
                  that.globalData.openid = res.data.openid
                  wx.setStorageSync('union_id', res.data.unionid)
                  wx.setStorageSync('openid', res.data.openid)
                  
                  that.globalData.startState=true
                }
              })
            }
          }
      
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              that.authStatus = false;
              typeof cb == "function" && cb(that.globalData.userInfo);
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    authStatus:false,
    scene: 0,
    page: false,
    navNewsState: false,
    openid: '',
    startState: false
  },
  
  // 获取服务器用户信息
  getserverUserData:function(){
    var that = this;
    that.authStatus = false;
    console.log('执行序列：3')
    console.log(that.globalData)
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/login',
      data: {
        openid: that.globalData.openid,
        union_id: that.union_id,
        name: that.globalData.userInfo.nickName,
        avatar: that.globalData.userInfo.avatarUrl,
        device_id: 3,
        token: that.union_id
      },
      success: function (res) {
        that.localUserData = res.data.data
        that.requestState = true
      }
    })
  },
  
  getThisDay: function (a, b) {  // 计算当前天数（年月日 转换 日）（通用）
    var startTime = (a.split(' ')[0]).split('-')
    var startYear = parseInt(startTime[0])
    var startMonth = parseInt(startTime[1])
    var startDay = parseInt(startTime[2])
    var endTime = (b.split(' ')[0]).split('-')
    var endYear = parseInt(endTime[0])
    var endMonth = parseInt(endTime[1])
    var endDay = parseInt(endTime[2])
    var benchmark = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (startYear <= endYear && startMonth <= endMonth){
      // if (startYear < endYear) {
        if (startYear % 4 == 0) {
          benchmark[1] = 29
        }
      // } else {
      //   if (endYear % 4 == 0) {
      //     benchmark[1] = 29
      //   }
      //   if (startMonth == 2) {
      //     if (startYear % 4 == 0) {
      //       benchmark[1] = 29
      //     }
      //   }
      // }
      var length;
      if (startMonth < endMonth) {
        length = endMonth - startMonth
      } else if (startMonth > endMonth) {
        length = 12 - startMonth + endMonth
      } else {
        length = 0
      }
      var monthIndex = startMonth - 1;
      var day = 0
      for (var i = 0; i < length; i++) {
        day += benchmark[monthIndex]
        monthIndex++
        if (monthIndex > 11) {
          monthIndex = 0
        }
      }
      day = day - startDay + endDay
    }else{
      day = 0
    }
    return day
  },

  getThisTime: function (a) {  // 计算当前时间(日 转换 年月日)（通用）
    var that = this
    var date = new Date()
    var year = date.getFullYear() //起始年
    var month = date.getMonth()+1 //起始月
    var day = date.getDate() + parseInt(a)  //起始日

    var benchmark = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year % 4 == 0) {
      benchmark[1] = 29
    }
    var a = parseInt(day / 28)
    for (var i=0;i<a;i++) {
      if (day>benchmark[month-1]) {
        day-=benchmark[month-1]
        month++
        if (month > 12) {
          year++
          month = 1
        }
      }
    }
    return year+'-'+month+'-'+day
  },
  
  masterFollowFun: function (a, b) {  // 关注达人方法（通用）
    var that = this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/Concern',
      data: {
        id: a,
        type: '1',
        token: that.union_id
      },
      success: function (res) {
        wx.showToast({
          title: '关注成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })
        b.setData({
          followState: true 
        })
      }
    })
  },

  getSharePricesFun: function (a, callback) {  //获取股票现价
    var that = this
    var scodeArray = []
    var priceArray = []
    for (var i = 0; i < a.length; i++) {
      scodeArray.push(a[i].scode)
      priceArray.push(a[i].in_price)
    }
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/getSharePrices?token=' + that.union_id,
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
  showTabBarRedDot: function () {    // 主导航新动态红点
    var that = this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/msg/unreadNum',
      data: {
        token: that.union_id
      },
      success: function (res) {
        if (parseInt(res.data.total)>0){
          // console.log('有最新消息')
          // if (!that.globalData.navNewsState){
            // console.log(that.globalData.navNewsState)
            // that.globalData.navNewsState = true
            // console.log('显示主导航消息动态红点')
            wx.showTabBarRedDot({
              index: 3,
              success: function (res) {
                // console.log('显示调用成功')
              },
              fail: function (res) {
                // console.log('显示调用失败')
              }
            })
          // }
        }else{
          // console.log('没有最新消息')
          // if (that.globalData.navNewsState){
            // that.globalData.navNewsState = false
            // console.log('隐藏主导航消息动态红点')
            wx.hideTabBarRedDot({
              index: 3,
              success: function(res){
                // console.log('隐藏调用成功')
              },
              fail: function(res){
                // console.log('隐藏调用失败')
              }
            })
          // }
        }
      }
    })
  },

  ping : function () {
    var that = this;
    setInterval(function(){
      wx.request({
        url: 'https://zhitouapi.romawaysz.com/app/ping?token=' + wx.getStorageSync('union_id'),
        success: function (res) {
          if (res.data.error != 0){
            that.getserverUserData()
          }
        }
      })
    },30000)
  },


  onShow: function () {
    var that = this
    if (that.globalData.scene == 0) {
      that.globalData.scene = 1
      that.onLoad
    }
    // setInterval(function(){that.showTabBarRedDot()},2000)
  },
  onHide: function () {
     this.globalData.scene -= 1;
  }
})