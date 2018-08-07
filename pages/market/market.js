// pages/market/market.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsData:'',
    score:null,
    address : null,
    region: ['选择省份', '选择城市', '选择区域'],
    city: '',
    area: '',
    address: null,
    haveAddress: null,
    id: 0,
    userAddress: '',
    name: '',
    phone: '',
    provinces: '',
    zip_code: ''
  },

  //对数据进行排序
  // compare: function (propertyName) {
  //   return function (obj1, obj2) {
  //     var val1 = parseInt(obj1[propertyName]);
  //     var val2 = parseInt(obj2[propertyName]);
  //     if (val2 < val1) {
  //       return -1;
  //     } else if (val2 > val1) {
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   }
  // },

  //获取用户积分
  getUserScore: function () {
    var that = this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/purse/index',
      data: {
        token: app.union_id
      },
      success: function (res) {
        console.log(res);
        that.setData({
          score: res.data.data.score
        })
      }
    })
  },
  //获取地址信息 

  getAddress: function () {
    var that = this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/getAddress?token=' + app.union_id,
      success: function (res) {
        console.log(res)
        if(res.data != ''){
          that.setData({
            address: res.data,
            name: res.data[0].name,
            phone: res.data[0].phone,
            userAddress: res.data[0].address,
            provinces: res.data[0].provinces,
            zip_code: res.data[0].zip_code,
            area: res.data[0].area,
            city: res.data[0].city,
            region: [res.data[0].provinces, res.data[0].city, res.data[0].area]
          })
        } else if (res.data == '') {
          that.setData({
            address: res.data
          })
        }
        
      }
    })
  },
  //获取商品 
  getGoods: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var address = that.data.address
    if (address == null ){
      wx.showModal({
        title: '',
        content: '请先设置收货地址',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '去设置',
        confirmColor: '',
        success: function(res) {
          if (res.confirm){
            wx.navigateTo({
              url: '/pages/myAddress/myAddress',
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
      return false;
    } 
    else if (address != '') {
      var addressStr = that.data.provinces + that.data.city + that.data.area + that.data.userAddress
      wx.showModal({
        title: '是否花费' + that.data.goodsData[id].price + '兑换' + that.data.goodsData[id].title,
        content: '收件人：' + that.data.name + ' 收货地址：' + addressStr + ' 联系方式：' + that.data.phone + ' 邮政编码' + that.data.zip_code,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '兑换',
        confirmColor: '',
        success: function (res) {
          if(res.confirm){
            if (parseFloat(that.data.score) < that.data.goodsData[id].price) {
              wx.showToast({
                title: '积分不足',
              })
            }else {
              wx.request({
                url: 'https://zhitouapi.romawaysz.com/goods/book?token=' + app.union_id,
                data : {
                  id: that.data.goodsData[id].id
                },
                success : function (res) {
                  wx.showToast({
                    title: '兑换成功，稍后客服会与您联系',
                    icon: none,
                    duration: 2000
                  })
                }
              })
              
            }
          }
        },
        fail: function (res) {

        },
        complete: function (res) { },
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
    var that = this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/goods/list?token=' + app.union_id + "&page=1&size=10&type=-1",
      success : function (res) {
        var resData = res.data.data
        // var sortedResData = resData.sort(that.compare('price'));
        that.setData({
          goodsData: resData
        })
        console.log(that.data.goodsData) 
      }
    })
    that.getUserScore();
    that.getAddress();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddress();
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