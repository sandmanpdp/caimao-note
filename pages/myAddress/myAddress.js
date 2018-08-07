// pages/myAddress/myAddress.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region:['选择省份','选择城市','选择区域'],
    provinces :'',
    city : '',
    area :'',
    address : null,
    haveAddress : null,
    id:0,
    userAddress:'',
    area : '',
    city : '',
    name: '',
    phone: '',
    provinces: '',
    zip_code : ''
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
    this.getAddress();
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
  
  },

  //验证输入值是否为空
  checkIsNone : function ( value ,text ) {
    if( value == '' ) {
      wx.showToast({
        title: text,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false;
    } else {
      return false;
    }
  },

  userNameInput: function (e) {   //收货人获取方法  
    this.setData({
      name: e.detail.value
    })
  },
  teleInput : function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  addressDetailInput : function (e) {
    this.setData({
      userAddress: e.detail.value
    })
  },

  codeInput : function (e) {
    this.setData({
      zip_code: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var changeValue = e.detail.value;
    this.setData({
      region: e.detail.value,
      provinces: changeValue[0],
      city: changeValue[1],
      area: changeValue[2]
    })
  },

  //获取地址
  getAddress: function () {
    var that = this;
    var id;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/getAddress?token=' + app.union_id,
      success: function (res) {
        var isAddress;
        var id;
        if(res.data.data == '') {
          id = 0;
        } else {
          id = res.data[0].id;
          that.setData({
            address: res.data.data,
            id: id,
            name: res.data[0].name,
            phone: res.data[0].phone,
            userAddress: res.data[0].address,
            provinces: res.data[0].provinces,
            zip_code: res.data[0].zip_code,
            area: res.data[0].area,
            city: res.data[0].city,
            region: [res.data[0].provinces, res.data[0].city, res.data[0].area]
          })
        }
      }
    })
  },

  // 点击确定 提交数据
  commitBtn : function () {
    var that = this;
    var id = that.data.id; 
    that.checkIsNone(that.data.userName,"收货人不能为空");
    that.checkIsNone(that.data.tele, "手机号码不能为空");
    that.checkIsNone(that.data.addressDetail, "详细地址不能为空");
    that.checkIsNone(that.data.code, "邮编不能为空");
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/setAddress?token=' + app.union_id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST", 
      data:{
        id:id,
        name: that.data.name,
        phone: that.data.phone,
        address: that.data.userAddress,
        zip_code: that.data.zip_code,
        provinces: that.data.provinces,
        city : that.data.city,
        area: that.data.area
      },
      success : function (res) {
        if(res.data.error == 0){
          wx.showToast({
            title: '设置成功',
            duration : 2000,
            icon : "none"
          })
        }
      }
    })
    wx.navigateBack({
      delta : 1
    })
  }
 
})