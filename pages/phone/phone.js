var app=getApp() 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneText: '请输入绑定手机号',
    phone: '',
    text: '获取验证码',
    time: 59,
    state: true,
    btnState: false,
    id: '',
    code: '',
    pageType : '',
    btnText : '',
    codeState: false,
    userInfo : '',
    bindPhoneType : '',
  },
  // 手机号
  phoneFun: function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  // 验证码
  codeFun: function (e) {
     var a=e.detail.value
     if(a.length>=6){
       this.setData({
         btnState: true,
         code: a
       })
     }else{
       this.setData({
         btnState: false
       })
     }
  },

  // 获取验证码
  setCodeFun: function(){
   var that=this;
   var a = that.data.phone
   if (a!='') {
     var b = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
     if (!b.test(a)) {
       wx.showToast({
         title: '请输入正确的手机号',
         icon: 'none',
         duration: 2000,
         mask: true,
         success: function () {
           that.setData({
             phone: ''
           })
         }
       })
     } else {
       if (that.data.state) {
         that.data.state = false
         that.getCodeFun(a)
         var time1 = setInterval(function () {
           if (that.data.time < 0) {
             clearInterval(time1)
             that.setData({
               text: '重新发送',
               time: 59
             })
             that.data.state = true
           } else {
             that.setData({
               text: that.data.time-- + 's'
             })
           }
         }, 1000)
       }
     }
   }else{
     wx.showToast({
       title: '手机号不能为空',
       icon: 'none',
       duration: 2000,
       mask: true
     })
   }
  },
// 请求验证码
getCodeFun: function(z){
  var that=this
  wx.request({
    url: 'https://zhitouapi.romawaysz.com/sms/send',
    data: {
      phone: z,
      type: 2,
      token: app.union_id
    },
    success: function(res){
      var a=res.data.error
      if(a==0){
        that.setData({
          id: res.data.data.id,
          codeState: true
        })
      }else if(a == 10055){
        wx.showToast({
          title: '请勿频繁操作',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }else {
        wx.showToast({
          title: a + '',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    }
  })
},

// 绑定手机号
setBindFun: function(z){
  //type 1: 绑定手机，2：其他
  var that=this;
  wx.request({
    url: 'https://zhitouapi.romawaysz.com/activity/bindPhone',
    data:{
      phone: that.data.phone,
      code: that.data.code,
      id: that.data.id,
      token: app.union_id,
      type: that.data.bindPhoneType
    },
    success: function(res){
      var a = res.data.error;
      var pageType = that.data.pageType;
      if(a==0){
        app.getserverUserData();
        wx.showToast({
          title: '绑定成功',
          duration : 2000,
          icon: 'success',
          success : function () {
            if (pageType == 'identiyAuth') {
              wx.redirectTo({
                url: '/pages/identityAuth/identityAuth?jumpFromType=identiyAuth',
              })
            } else if (pageType == 'bindPhone') {
              wx.navigateBack({
                delta: 1
              })
            } else if (pageType == 'identiyAuthDrawcash') {
              wx.redirectTo({
                url: '/pages/identityAuth/identityAuth?jumpFromType=identiyAuthDrawcash',
              })
            } else {
              wx.redirectTo({
                url: '/pages/drawcash/drawcash',
              })
            }
          }
        })
        
      } else if (a == 10051) {
        wx.showToast({
          title: '验证码错误',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      } else if (a == 10059) {
        wx.showToast({
          title: '该手机号已绑定',
          icon: 'none',
          duration: 2000,
          mask: true,
          success : function () {
            wx.navigateBack({
              delta : 1
            })
          }
        })
      }
    }
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
        phone: res.data.data.phone
      })
    }
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    app.getserverUserData();
    var that =this;
    that.getNewUserInfo();
    var pageType = options.type;
    var btnText = '';
    var bindPhoneType = '';// 1: 实名验证 2： 绑定手机
    if (pageType == 'identiyAuth' || pageType == 'identiyAuthDrawcash'){
      btnText = '下一步';
      bindPhoneType = 2;
      wx.setNavigationBarTitle({
        title: '实名认证'
      })
    } else if (pageType == 'bindPhone') {
      btnText = '立即绑定'
      bindPhoneType = 1;
      wx.setNavigationBarTitle({
        title: '绑定手机号'
      })
    }
    that.setData({
      pageType: pageType,
      btnText : btnText,
      bindPhoneType: bindPhoneType
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
    if (app.localUserData.phone != '') {
      this.setData({
        phoneText: '当前绑定手机号：'+app.localUserData.phone
      })
    }

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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})