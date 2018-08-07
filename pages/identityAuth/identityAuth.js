// pages/identityAuth/identityAuth.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankArray : [
      '中国银行','工商银行','建设银行'
    ],
    bankArrayIndex:0,
    jumpFromType : '',
    username : '',
    idCard : '',
    certCode : '',
    bankNum : '',
    bankName : '',
    isBankNum: false
  },
  // BankChange : function (e) {
  //   this.setData({
  //     bankArrayIndex: e.detail.value
  //   })
  // },

  //绑定真实姓名
  bindUsernameInput : function (e) {
    this.setData({
      username: e.detail.value
    })
    console.log(e.detail.value)
  },
 //绑定身份证
  bindIdInput: function (e) {
    this.setData({
      idCard: e.detail.value
    })
    console.log(e.detail.value)
  },

  //绑定职业编号
  bindCodeInput: function (e) {
    this.setData({
      certCode: e.detail.value
    })
  },
  //绑定银行卡号码
  bindBankNumInput: function (e) {
    this.setData({
      bankNum: e.detail.value
    })
    console.log("this.data.bankNum" + this.data.bankNum )
  },


  //绑定开户银行
  bindBankNameInput: function (e) {
    this.setData({
      bankName: e.detail.value
    })
    
  },
  //验证身份证号
  validateIdcard : function (e) {
    var that = this;
    if (!that.validate.idCard(e.detail.value)) {
      wx.showToast({
        title: '身份证号信息填写错误',
        duration : 2000,
        icon: 'none'
      })
      return
    }
  },
  //获取数据

  getAuthInfo : function () {
    var that = this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/getVeryInfo?token=' + app.union_id,
      success : function (res) {
        var resData = res.data.data;
        if(res.data.error == 0){
          that.setData({
            message: resData.message,
            bankName: resData.card_name,
            bankNum: resData.card_no,
            idCard: resData.cardID,
            certCode: resData.worksCode,
            username: resData.realname
          })
        }
      }
    })
  },

  getBankName : function () {
    var that = this;
    var bankNum = that.data.bankNum;
    if (bankNum != null) {
      wx.request({
        url: 'https://zhitouapi.romawaysz.com/account/getBankInfo?token=' + app.union_id,
        data: {
          cardnum: bankNum
        },
        success :function (res) {
          if(res.data.error == 0){
            if (res.data.data.bank_name){
              that.setData({
                bankName: res.data.data.bank_name,
                 isBankNum: true
              })
            }else {
              wx.showToast({
                title: '请正确填写储蓄卡卡号',
                duration: 2000,
                icon : 'none'
              })
              that.setData({
                isBankNum: false
              })
            }
          }
          
          console.log(that.data.bankName)
        }
      })
    }
  },

  //数据校验
  validate : {
    isNull : function (input,data) {
      if (data == '' || data == 'undefined' || data == undefined || data == null || data == 0) {
        wx.showToast({
          title: input + '不能为空',
          duration: 2000,
          icon : 'none'
        })
        return true;
      }
      return false;
    },
    idCard: function (code){
      code = code.toUpperCase();
      var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
      var tip = "";
      var pass = true;
      if (!code || !/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
      }

      else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
      }
      else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
          code = code.split('');
          var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
          //校验位
          var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
          var sum = 0;
          var ai = 0;
          var wi = 0;
          for (var i = 0; i < 17; i++) {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
          }
          var last = parity[sum % 11];
          if (parity[sum % 11] != code[17]) {
            tip = "校验位错误";
            pass = false;
          }
        }
      }

      return pass;
    }
  },

  //提交数据
  submitFunc: function () {
    var that = this;
    var jumpFromType = that.data.jumpFromType;
    var username = that.data.username;
    var idCard = that.data.idCard;
    var certCode = that.data.certCode;
    var bankNum = that.data.bankNum;
    var bankName = that.data.bankName;
    var dataArray = [
      {
        key: "真实姓名",
        value: username
      },
      {
        key: "身份证",
        value: idCard
      },
      {
        key: "执业编码",
        value: certCode
      },
      {
        key: "银行卡号",
        value: bankNum
      },
      {
        key: "开户银行",
        value: bankName
      },
    ];
    for (var i = 0; i < dataArray.length; i++) {
      if (that.validate.isNull(dataArray[i].key, dataArray[i].value)) {
        return 
      }
    }
    if (!that.validate.idCard(idCard)) {
      wx.showToast({
        title: '身份证号信息填写错误',
        duration: 2000,
        icon: 'none'
      })
      return
    }
    if (!that.data.isBankNum) {
      wx.showToast({
        title: '银行卡信息填写错误',
        duration: 2000,
        icon: 'none'
      })
      return
    }
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/UpdateVery?token=' + app.union_id,
      data: {
        realname: username,
        cardID: idCard,
        worksCode: certCode,
        cardnum: bankNum,
        bankname: bankName
      },
      success: function (res) {
        var error = res.data.error;
        //jumpFromType = identiyAuth 主动认证
        //jumpFromType = identiyAuthDrawcash 从提现接口认证
        if (error == 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.redirectTo({
                url: '/pages/authSuccess/authSuccess',
              })
            }
          })
        }else {
          wx.showToast({
            title: '错误'+error+',请稍后重试',
            icon : 'none',
            duration : 2000
          })
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //jumpFromType = identiyAuth 主动认证
    //jumpFromType = identiyAuthDrawcash 从提现接口认证
    var jumpFromType = options.jumpFromType;
    this.setData({
      jumpFromType: jumpFromType
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
    this.getAuthInfo()
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