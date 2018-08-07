// pages/component/auth/auth.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo: function (e) {
      console.log(e.detail.errMsg)
      console.log(e.detail.userInfo)
      console.log(e.detail.rawData)
      if (app.globalData.userInfo == null){
        app.globalData.userInfo = e.detail.userInfo;
        app.authStatus = false;
        
      }
      app.authStatus = false;
    },
  }
})
