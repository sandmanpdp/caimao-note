//获取应用实例
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    own: false,
    sign : '',
    size: 10,
    bottomState: true,  //是否显示下拉状态
    noteNull: false,  //笔记是否为空
    viewNull: false,  //观点是否为空
    order: 0, //导航序列 
    master: [],  //作者信息
    masterNote: [],  //笔记数据
    notePage: -1,  //笔记页码
    masterView: [], //观点数据
    viewPage: -1,  //观点页码
    askTheStockNav: 0, //问股 
    askTheStock: [ //问股数据
      {
        id: 334,
        state: true,
        title: '笨鸟科技',
        stockCode: '111111',
        price: 100,
        depict: '股价运行在大势线和趋势支撑线上方，即将突破操盘线，根据趋势稳盈指标显示，目前正是低吸良机阿斯达沙发手动阀打算个地方股份日月潭你们',
        time: '15:48',
        day: '10/27'
      }
    ],

  },
  // 关注达人方法
  masterFollowFun: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/Concern?open=1&debug=1',
      data: {
        id: id,
        type: '1',
        token: app.union_id
      },
      success: function (res) {
        wx.showToast({
          title: '关注成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })
        that.setData({
          'master.is_concern': 1
        })
      },
      fail: function (err) { //请求失败
        wx.showToast({
          title: '关注失败',
          icon: 'success',
          duration: 1000,
          mask: true
        })
      },
      complete: function () { //请求完成后执行的函数 
      }
    })
  },
  // 取消关注方法
  followClearFun: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否取消关注',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://zhitouapi.romawaysz.com/account/Concern',
            data: {
              id: e.currentTarget.id,
              type: 0,
              token: app.union_id
            },
            success: function (res) {
              if(res.data.error==0){
                var a={}
                var b = 'master.is_concern'
                a[b]=0
                that.setData(a)
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                })
              }else{
                wx.showToast({
                  title: '取消失败',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                })
              }
            }
          });
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  fansLinkFun: function (e) {  // 粉丝列表跳转方法
    wx.navigateTo({
      url: '/pages/fans/fans?id=' + e.currentTarget.id
    })
  },
  // 导航切换方法
  navCutFun: function (e) {
    var that = this;
    var a = e.currentTarget.id;
    that.setData({
      order: a,
      bottomState: true,  //是否显示下拉状态
      noteNull: false,  //笔记是否为空
      viewNull: false,  //观点是否为空
    })
    if (a == 0) {
      this.getNoteFun(a)
    } else if (a == 1) {
      this.getViewFun(a)
    }
  },
  // 笔记详情跳转方法
  masterNoteFun: function (e){
    wx.navigateTo({
      url: '/pages/notedetails/notedetails?id=' + e.currentTarget.id + '&uid=' + e.currentTarget.dataset.uid
    })
  },
  // 观点详情跳转方法
  viewJumpFun: function (e) {
    wx.navigateTo({
      url: '/pages/viewdetails/viewdetails?id=' + e.currentTarget.id
    })
  },
  // 提问跳转方法
  masterQuizFun: function(e){
    // wx.navigateTo({
    //   url: '/pages/askreward/askreward?id=' + e.currentTarget.id
    // })
    wx.showToast({
      title: '暂未开发',
    })
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    app.globalData.page = true
    app.globalData.scene += 1
    this.getUserNote(options)
    this.getNoteFun(options)  
    this.getViewFun(options)  
  },
  
  getUserNote: function (a) {   //获取作者信息  
    var that = this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/account/otherUserInfo',
      data: {
        id: a.id,
        token: app.union_id
      },
      success: function (res) {
        var b=false
        if (a.id == app.localUserData.user_id){
          b=true
        }
        that.setData({
          master: res.data.data,
          own: b
        })

        if (that.data.master.sign) {
          that.setData({
            sign: that.data.master.sign
          })
        } else {
          that.setData({
            sign: '这个人很懒，什么都没有留下'
          })
        }
      }
    })  
  },
  getNoteFun: function (a) {  // 获取作者笔记信息   
    var that=this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/noteList',
      data: {
        id: a.id,
        size: that.data.size,
        next: '-1',
        order: 'new',
        area: 0,
        index: '-1',
        token: app.union_id
      },
      success: function (res) {
        var a = res.data.data
        if (a != "") {
          if(a.length<that.data.size){
            var d=true
          }else{
            var d=false
          }
          var b = that.data.masterNote || []
          var c = b.length - 1
          if (c < 0) { c = 0 }
          for (var i = 0; i < a.length; i++) {
            b.push(a[i])
            b[b.length - 1]['targetDay'] = app.getThisDay(a[i].created_at, a[i].work_date)
            if(a[i].is_reach == -1){
              b[b.length - 1]['actualDay'] = app.getThisDay(a[i].created_at, res.data.time);
            }else {
              b[b.length - 1]['actualDay'] = app.getThisDay(a[i].created_at, a[i].work_date);
            }
            if (a[i].is_look == -1 && a[i].price != 0 && a[i].is_reach ==-1 ){ //没看过 付费 进行中
              b[b.length - 1]['readOrbuyFun'] = 'buyFun'
            } else {
              b[b.length - 1]['readOrbuyFun'] = 'readFun'
            }
          }
          app.getSharePricesFun(a, function (data) {
            for (var i = 0; i < data.length; i++) {
              if (a[i].is_reach != -1) { //笔记结束
                a[c]['actualTop'] = ((a[i].out_price - a[i].in_price) / a[i].in_price * 100).toFixed(2);
              } else if (a[i].is_reach == -1 && a[i].price != 0 && a[i].is_look < 0 ){
                a[c]['actualTop'] = "****" // 笔记未结束&&不是免费&&没看过
              } else {
                a[c]['actualTop'] = data[i] 
              }
              c++
            }
            
            that.setData({
              noteNull: d,
              bottomState: !d,
              masterNote: b,
              notePage: res.data.next
            })
          })
        
        } else {
          that.setData({
            noteNull: true,
            bottomState: false
          })
        }
      }
    })
  },
  getViewFun: function (a) {  // 获取作者观点信息   
    var that = this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/view/list',
      data: {
        id: a.id,
        size: that.data.size,
        next: that.data.viewPage,
        token: app.union_id
      },
      success: function (res) {
        var a = res.data.data
        if (a != "") {
          if(a.length<that.data.size){
            var d=true
          }else{
            var d=false
          }
          var b = that.data.masterView || []
          var c = b.length - 1
          if (c < 0) { c = 0 }
          for (var i = 0; i < a.length; i++) {
            b.push(a[i])
          }
          that.setData({
            viewNull: d,
            bottomState: !d,
            masterView: b,
            viewPage: res.data.next
          })
        } else {
          that.setData({
            viewNull: true,
            bottomState: false
          })
        }
      }
    })
  },
  //购买方法
  buyFun: function (e) {
    console.log("buyFun");
    // var that = this
    // wx.request({
    //   url: "https://zhitouapi.romawaysz.com/note/createRead",
    //   data: {
    //     sId: e.currentTarget.id.split("_")[1],
    //     type: 2,
    //     token: app.union_id
    //   },
    //   success: function (res) {
    //     if (res.data.error == 0) {
    //       wx.navigateTo({
    //         url: '/pages/notedetails/notedetails?id=' + e.currentTarget.id.split("_")[1] + '&uid=' + e.currentTarget.dataset.uid
    //       })
    //     } else {
    //       wx.navigateTo({
    //         url: '/pages/notebuy/notebuy?id=' + e.currentTarget.id.split("_")[1] + '&uid=' + e.currentTarget.dataset.uid
    //       })
    //     }
    //   }
    // })
    wx.navigateTo({
      url: '/pages/notebuy/notebuy?id=' + e.currentTarget.id + '&uid=' + e.currentTarget.dataset.uid
    })
  },

  // 阅读方法
  readFun: function (e) {
    console.log("readFun");
    var that = this;
    if (that.data.user_id != e.currentTarget.dataset.uid) {

      wx.request({
        url: "https://zhitouapi.romawaysz.com/note/createRead",
        data: {
          sId: e.currentTarget.id,
          type: 2,
          token: app.union_id
        },
        success: function (res) {

        }
      })
    }
    wx.navigateTo({
      url: '/pages/notedetails/notedetails?id=' + e.currentTarget.id + '&uid=' + e.currentTarget.dataset.uid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    //this.getNoteFun(options)
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var a=this.data.order
    if (a==0){
      this.getNoteFun(a)
    } else if (a == 1){
      this.getViewFun(a)
    }
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