const app = getApp();
const url = 'https://zhitouapi.romawaysz.com';

const getData = {
  //用户中心
  userCenter: {
    //获取用户信息
    getUserInfo: function (para, callback) {
      var resData = '';
      wx.request({
        url: url + '/account/userInfo',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        },
      })
    },
    //更改用户信息
    setChangeBase : function (para, callback) {
      var resData = '';
      wx.request({
        url: url + '/account/changeBase',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        }
      })
    },
    //获取所有开关状态
    getOptionSet : function (para, callback) {
      var resData = '';
      wx.request({
        url: url + '/app/optionSet',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        }
      })
    },
    //设置某个开关
    setOptionSet : function (para, callback) {
      var resData = '';
      wx.request({
        url: url + '/app/modifyOptionSet',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        }
      })
    },
    //获取他人数据 
    getOtherUserInfo: function (para, callback) {
      var resData = '';
      wx.request({
        url: url + '/account/otherUserInfo',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        }
      })
    },
    //设置收货地址
    setAddress: function (para, callback) {
      var resData = '';
      wx.request({
        url: url + '/account/setAddress',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        }
      })
    },
    //获取收货地址
    getAddress: function (para, callback) {
      var resData = '';
      wx.request({
        url: url + '/account/getAddress',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        }
      })
    },
    //获取银行卡信息
    getBankInfo: function (para, callback) {
      var resData = '';
      wx.request({
        url: url + '/account/getBankInfo',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        }
      })
    },
    //用户老师认证
    setUpdateVery: function (para, callback) {
      var resData = '';
      wx.request({
        url: url + '/account/UpdateVery',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        }
      })
    },
  },
  //关于笔记模块
  note : {
    setNote : function (para,callback) {
      var resData = '';
      wx.request({
        url: url + '/note/create',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        },
      })
    },
    getNoteList: function (para, callback) {
      var resData = '';
      wx.request({
        url: url + '/note/noteList',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        },
      })
    },
    getNoteDetail: function (para, callback) {
      var resData = '';
      wx.request({
        url: url + '/note/detail',
        data: para,
        success: function (res) {
          resData = res.data;
          callback(resData)
        },
      })
    },
    
  }

}

module.exports.getUserInfo = getData.userCenter.getUserInfo;


// module.exports.changeBase = getData.userCenter.changeBase;