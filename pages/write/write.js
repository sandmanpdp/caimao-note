var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    nav: true, //导航
    maskNoteState: false,  //是否显示笔记须知遮罩
    maskViewState: false,  //是否显示观点须知遮罩
    maskViewpointState: false,  //是否显示观点须知遮罩
    chargeArray: ['免费', '积分'],  //收费类型数组
    priceArray: [], //标价数组

    shareValue: '', //笔记股票
    shareCode: '', //笔记股票
    expectDateValue: '', //笔记预期时间
    endDateIndex: 0, //笔记限时下标
    endDateArray: [], //笔记限时数组
    rise: '', //笔记上涨
    stop: '', //笔记止损
    titleValue: '', //标题
    logicValue: '', //逻辑
    priceIndex: 0, //笔记标价下标
    peopleArray: [],  //笔记人数数组
    peopleIndex: null,  //笔记人数下标
    noteChargeIndex: 0,  //笔记收费类型下标

    lableValue: [],  //标签的值
    label: [ //笔记标签
      { id: 0, state: false, title: '装饰园林' },
      { id: 1, state: false, title: '农林牧渔' },
      { id: 2, state: false, title: '货币金融' },
      { id: 3, state: false, title: '紫金矿业' },
      { id: 4, state: false, title: '运输设备' }
    ],

    viewpointTitleValue: '',  //观点标题值
    viewpointDepictValue: '',  //观点简介值
    viewpointContentValue: '',  //观点内容值
    viewChargeIndex: 0,  //收费下标
    viewPriceIndex: 0,  //观点标价下标

    matchingStockCodeArray: [],  //用于匹配的股票代码数组
    showStockCodeArray: [],  //用于显示匹配后的股票代码数组
    matchingState: false,  //是否匹配成功

    matchingTableArray: [],  //用于匹配的标签数组
    showTableArray: [],  //用于显示匹配后的标签数组
    tableState: false,  //是否匹配成功

    timeIndex: 0,
    timeArray: [],

    riseIndex: 0,
    riseArray: [],

    stopIndex: 0,
    stopArray: [],

    releaseState: true,
    readMaskState: false,

    publishSuccess: false,// by pdp
    publishSuccessImgSrc: "../images/publishSuccess.png",// by pdp
    publishId: "",//by pdp
    nextPage: -1,// by pdp
    dataSize: 30,//by pdp
    notePage: 0,//by pdp
    resNoteData: null,//by pdp
    pickerNameArray: null,
    note_id: 0,
    id: null,//笔记发布成功返回的笔记id
    note_index: 0,
    time: '',
    xPrice: ''
  },
  //导航选择方法
  navOptFun: function (e) {
    var a
    if (e.currentTarget.id == 0) {
      a = true
    } else {
      a = false
    }
    this.setData({
      nav: a
    })
  },
  //标题获取方法
  bindTitleInput: function (e) {
    this.setData({
      titleValue: e.detail.value
    })
  },
  //逻辑获取方法
  bindLogicInput: function (e) {
    this.setData({
      logicValue: e.detail.value
    })
  },
  // 股票获取方法
  bindKeyInput: function (e) {
    var a = e.detail.value;
    var b = this.data.matchingStockCodeArray;
    var c = [];
    var d = false;
    this.setData({
      shareValue: a
    })
    if (e.detail.cursor != 0) {
      for (var i = 0; i < b.length; i++) {
        if (c.length < 10) {
          //股票代码匹配从后往前
          // if (b[i].name.indexOf(a) != -1) {
          //   c.push(b[i])
          //   d = true
          // }
          //股票代码匹配从前往后
          if (b[i].searchName.indexOf(a) == 0 || b[i].searchName.indexOf(a.toUpperCase()) >= 7) {
            c.push(b[i])
            d = true
          }
        }
      }
    }
    if (e.detail.cursor < 6) {
      this.setData({
        lableValue: [],
        label: [
          { id: 0, state: false, title: '装饰园林' },
          { id: 1, state: false, title: '农林牧渔' },
          { id: 2, state: false, title: '货币金融' },
          { id: 3, state: false, title: '紫金矿业' },
          { id: 4, state: false, title: '运输设备' }
        ],
      })
    }
    this.setData({
      matchingState: d,
      showStockCodeArray: c,
      // shareValue: e
    })
  },
  // 预期时间获取方法
  timeChange: function (e) {
    var a = parseInt(e.detail.value) + 1;

    // if (a < 5) {
    //   this.getRise(3,50)
    // } 

    if (a < 5) {
      this.getRise(3, 10 * parseInt(a));
    }

    else if (a >= 5 && a <= 10) {
      this.getRise(5, 50)
    } else {
      this.getRise(parseInt(a / 2), 50)
    }
    this.setData({
      timeIndex: a - 1,
      riseIndex: 0
    })
  },
  // 上涨获取方法
  riseChange: function (e) {
    this.setData({
      riseIndex: e.detail.value
    })
  },
  // 止损获取方法
  stopChange: function (e) {
    this.setData({
      stopIndex: e.detail.value
    })
  },
  //关闭阅览
  falseFun: function () {
    this.setData({
      readMaskState: false
    })
  },
  //打开阅览
  trueFun: function () {
    var that = this
    var date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    if (that.data.shareCode != '') {
      wx.request({
        url: 'https://zhitouapi.romawaysz.com/note/getSharePrices?token=' + app.union_id,
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          code: that.data.shareCode
        },
        success: function (res) {
          var a = res.data.data[0].S_Price
          that.setData({
            xPrice: a
          })
        }
      })
    }
    that.setData({
      time: M + '/' + D + '  ' + h + ":" + m,
      readMaskState: true
    })
  },
  //标签选择方法
  labelOptFun: function (e) {
    var param = {}
    for (var i = 0; i < this.data.label.length; i++) {
      var a = 'label[' + i + '].state';
      if (i == e.currentTarget.id) {
        if (this.data.label[i].state) {
          param[a] = false
          this.data.lableValue.splice(this.data.lableValue.indexOf(this.data.label[i].title), 1)
        } else {
          if (this.data.lableValue.length < 2) {
            param[a] = true
            this.data.lableValue.push(this.data.label[i].title)
          } else {
            wx.showToast({
              title: '标签最多选择两个',
              icon: 'none',
              duration: 2000,
              mask: true
            })
            return false
          }
        }
      }
    }
    this.setData(param)
  },
  // 标价获取方法
  bindPriceChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      priceIndex: e.detail.value
    })
  },
  // 限时获取方法
  bindEndDateChange: function (e) {
    this.setData({
      endDateIndex: e.detail.value
    })
    console.log("endDateIndex" + e.detail.value);
  },
  // 参与人数获取方法
  bindPeopleChange: function (e) {
    this.setData({
      peopleIndex: e.detail.value
    })
  },
  //笔记收费类型选择方法
  noteChargeChange: function (e) {
    this.setData({
      noteChargeIndex: e.detail.value,
      endDateIndex: 0,
      peopleIndex: 0,
      priceIndex: 0
    })
  },

  // 笔记发布方法
  noteReleaseFun: function (e) {
    var that = this
    if (that.data.releaseState) {
      //that.data.releaseState=false
      var a = that.data.shareCode;
      var b = that.data.titleValue;
      var c = that.data.logicValue;
      var d = that.data.lableValue;
      var e = that.data.endDateIndex == 0 ? -1 : app.getThisTime(that.data.endDateIndex);
      var f = that.data.timeArray[that.data.timeIndex];
      var g = that.data.peopleIndex == 0 ? -1 : that.data.peopleIndex;
      var h = that.data.riseArray[that.data.riseIndex];
      var i = that.data.stopArray[that.data.stopIndex];
      if (b == "") {
        wx.showToast({
          title: '标题不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false
      } else if (c == "") {
        wx.showToast({
          title: '逻辑不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false
      } else if (a == "") {
        wx.showToast({
          title: '股票不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false
      } else if (f == "") {
        wx.showToast({
          title: '时间不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false
      } else if (h == "") {
        wx.showToast({
          title: '涨幅不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false
      } else if (i == "") {
        wx.showToast({
          title: '止损不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false
      } else if (d == "") {
        wx.showToast({
          title: '标签不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return false;
      }
      var y = that.data.noteChargeIndex;
      var z = that.data.priceArray[that.data.priceIndex];
      wx.request({
        url: 'https://zhitouapi.romawaysz.com/note/create',
        data: {
          need_price: y == 0 ? 0 : z,
          hook_price: y == 0 ? 0 : z,
          type: 1,
          code: a,
          title: b,
          content: c,
          tag: d.toString(),
          limit_date: e,
          work_date: f,
          limit_look: g,
          rise: h,
          fall: i,
          token: app.union_id
        },
        success: function (res) {
          //by pdp
          var x = res.data.error
          if (x == '0') {
            that.setData({
              publishSuccess: true,
              readMaskState: false,
              id: res.data.data.id
            })
            that.data.publishId = res.data.data.id;
            // that.setPulishSucMasktrueFun();
            // that.data.publishSuccess = true;
            // wx.showToast({
            //   title: '发布成功',
            //   icon: 'success',
            //   duration: 1000,
            //   mask: true,
            //   success:function(){
            //     that.noteFesetDataFun()
            //     app.getserverUserData()
            //     // wx.pageScrollTo({
            //     //   scrollTop: 0
            //     // })
            // wx.navigateTo({
            //   url: '/pages/notedetails/notedetails?id=' + res.data.data.id + '&uid=' + app.localUserData.user_id
            // })
            //   }

            // }) 
            wx.setStorage({
              key: 'noteId',
              data: res.data.data.id,
            })

          } else if (x == '10080') {
            wx.showToast({
              title: '余额不足',
              icon: 'none',
              duration: 2000,
              mask: true
            })
            return false;
          } else if (x == 10002) {
            wx.showToast({
              title: '股票代码暂时不可用',
              icon: 'none',
              duration: 2000,
              mask: true
            })
            return false;
          } else {
            wx.showToast({
              title: x,
              icon: 'none',
              duration: 2000,
              mask: true
            })
            return false;
          }
          that.data.releaseState = true
        }
      })
    }
  },

  // 笔记重置数据方法
  noteFesetDataFun: function () {
    this.setData({
      shareValue: '',
      expectDateValue: '',
      endDateIndex: 0,
      rise: '',
      stop: '',
      titleValue: '',
      logicValue: '',
      priceIndex: 0,
      peopleIndex: 0,
      noteChargeIndex: 0,
      lableValue: [],
      label: [
        { id: 0, state: false, title: '装饰园林' },
        { id: 1, state: false, title: '农林牧渔' },
        { id: 2, state: false, title: '货币金融' },
        { id: 3, state: false, title: '紫金矿业' },
        { id: 4, state: false, title: '运输设备' }
      ],
      timeIndex: 0,
      riseIndex: 0,
      stopIndex: 0,
      readMaskState: false,
      time: '',
      xPrice: ''
    })
  },
  // 观点重置数据方法
  viewFesetDataFun: function () {
    this.setData({
      viewpointTitleValue: '',  //观点标题值
      viewpointDepictValue: '',  //观点简介值
      viewpointContentValue: '',  //观点内容值
      viewChargeIndex: 0,  //收费下标
      viewPriceIndex: 0  //观点标价下标
    })
  },
  getTime: function () {  //遍历时间数组
    var a = []
    for (var i = 1; i < 31; i++) {
      a.push(i)
    }
    this.setData({
      timeArray: a
    })
  },
  getRise: function (b, c) {  //遍历涨幅数组
    var a = []
    for (var i = b; i <= c; i++) {
      a.push(i)
    }
    this.setData({
      riseArray: a
    })
  },
  getStop: function () {  //遍历止损数组
    var a = []
    for (var i = 2; i < 11; i++) {
      a.push(i)
    }
    this.setData({
      stopArray: a
    })
  },
  getPrice: function (b, c) {  //遍历标价数组
    var a = []
    for (var i = b; i < c; i++) {
      a.push(i * 10)
    }
    this.setData({
      priceArray: a
    })
  },
  getDay: function (b, c) {  //遍历天数数组
    var a = []
    for (var i = b; i < c; i++) {
      a.push("发布" + i + "天后不可购买")
    }
    a.unshift('不限制购买时间')
    this.setData({
      endDateArray: a
    })
  },
  getPeople: function (b) {  //遍历人数数组
    var a = []
    for (var j = 1; j < 10; j++) {
      a.push("仅限" + j + "人阅读")
    }
    for (var i = b; i < 11; i++) {
      a.push("仅限" + i * 10 + "人阅读")
    }
    a.unshift('不限制阅读人数')
    this.setData({
      peopleArray: a
    })
  },
  viewpointTitleInput: function (e) {  //观点标题获取方法  
    this.setData({
      viewpointTitleValue: e.detail.value
    })
  },
  bindDepictInput: function (e) {  //观点简介获取方法
    this.setData({
      viewpointDepictValue: e.detail.value
    })
  },
  bindContentInput: function (e) {  //观点描述获取方法
    this.setData({
      viewpointContentValue: e.detail.value
    })
  },
  //观点发布方法
  viewpointReleaseFun: function () {
    var that = this
    var a = that.data.viewpointTitleValue;
    var b;
    var c = that.data.viewpointContentValue;
    if (c.length > 50) {
      b = c.substring(0, 49) + "...";
    } else {
      b = c;
    }
    if (a == '') {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false;
    }
    // else if (b == '') {
    //   wx.showToast({
    //     title: '介绍不能为空',
    //     icon: 'none',
    //     duration: 2000,
    //     mask: true
    //   })
    //   return false;
    // } 
    else if (c == '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false;
    }
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/view/create?token=' + app.union_id,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        title: a,
        intro: b,
        content: c,
        price: that.data.viewChargeIndex == 0 ? 0 : that.data.priceArray[that.data.viewPriceIndex],
        type: that.data.viewChargeIndex == 0 ? 1 : that.data.viewChargeIndex
      },
      success: function (res) {
        var d = res.data.error;
        var viewId = res.data.data.id;
        var noteIndex = that.data.note_index - 1;
        var noteId;
        if (noteIndex > -1) {
          noteId = that.data.resNoteData[noteIndex].id;
        } else {
          noteId = -1;
        }

        if (d == 0) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000,
            mask: true
          })
          that.viewFesetDataFun()
          app.getserverUserData()
          wx.pageScrollTo({
            scrollTop: 0
          })
          wx.navigateTo({
            url: '/pages/viewdetails/viewdetails?id=' + res.data.data.id
          })
          //关联笔记
          //判断是否关联观点 如果关联则发送请求 /note/bindNoteView  by pdp
          if (noteIndex > -1) {
            wx.request({
              url: 'https://zhitouapi.romawaysz.com/note/bindNoteView?view_id=' + viewId + "&note_id=" + noteId + '&token=' + app.union_id,
              success: function (res) {
                if (res.data.error == 0) {
                  console.log("关联成功");
                }
              }
            })
          }
        } else if (d == 10080) {
          wx.showToast({
            title: '余额不足',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else {
          wx.showToast({
            title: d + '',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      }
    })
  },

  //关联笔记 note_id
  relatedNote: function (e) {
    var that = this;
    //console.log(e.detail.value);
    that.setData({
      note_index: e.detail.value
    })
    console.log(that.data.note_index);
  },
  viewChargeChange: function (e) {  //获取观点收费类型
    this.setData({
      viewChargeIndex: e.detail.value
    })
  },
  viewPriceChange: function (e) {  //获取标价值
    this.setData({
      viewPriceIndex: e.detail.value
    })
  },
  setNoteMaskTrueFun: function () {  //打开遮罩方法
    this.setData({
      maskNoteState: true
    })
  },
  setNoteMaskFalseFun: function () {  //关闭遮罩方法
    this.setData({
      maskNoteState: false
    })
  },
  setViewMaskTrueFun: function () {  //打开遮罩方法
    this.setData({
      maskViewState: true
    })
  },
  setViewMaskFalseFun: function () {  //关闭遮罩方法
    this.setData({
      maskViewState: false
    })
  },
  setPulishSucMaskFalseFun: function () {   //发布笔记成功关闭遮罩方法 by pdp
    this.setData({
      maskViewState: false
    })
  },
  setPulishSucMasktrueFun: function () {  //发布笔记成功打开遮罩方法 by pdp
    this.setData({
      maskViewState: true
    })
  },
  shareMaskEnd: function () {  //关闭股票代码遮罩
    var that = this
    if (that.data.shareValue != '') {
      setTimeout(function () {
        var a = that.data.showStockCodeArray
        var b = /[0-9]{6}\([0-9a-zA-Z\u2E80-\u9FFF]+\)/
        var c = that.data.shareValue
        var d = a[0].code
        if (c.match(b) != null) {
          if (a.length == 1) {
            that.data.shareCode = d
          }
          that.labelFun(that.data.shareCode)
          that.setData({
            matchingState: false
          })
        } else if (that.data.showStockCodeArray.length == 1) {
          that.setData({
            shareValue: that.data.showStockCodeArray[0].name,
            shareCode: that.data.showStockCodeArray[0].code,
            matchingState: false
          })
          that.labelFun(that.data.showStockCodeArray[0].code)
        }
        else {
          wx.showToast({
            title: '请输入正确的股票代码或名称',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          that.setData({
            shareValue: '',
            matchingState: false
          })
        }
      }, 500)
    }
  },

  //选择唯一的股票代码
  confirmShare: function () {
    if (this.data.showStockCodeArray.length == 1) {
      this.setData({
        shareValue: this.data.showStockCodeArray[0].name,
        shareCode: this.data.showStockCodeArray[0].code
      })
    }
  },

  labelFun: function (z) {  //获取标签匹配数据
    var that = this
    wx.request({
      url: 'https://share.romawaysz.com/static/upload/hxtc/' + z + '.js',
      success: function (res) {
        if (res.data != '') {
          var a = res.data.content.split(' ')
          var b = []
          var c = /^[\u2E80-\u9FFF]+$/
          var d = []
          for (var i = 0; i < a.length; i++) {
            if (d.length < 6) {
              if (c.test(a[i])) {
                d.push(a[i])
              }
            }
          }
          for (var i = 0; i < d.length; i++) {
            b.push({
              id: i,
              state: false,
              title: d[i]
            })
          }
          that.setData({
            label: b
          })
        }
      }
    })
  },

  //by pdp
  toNotedetails: function () {
    this.setData({
      publishSuccess: false,
      readMaskState: false
    })
    wx.navigateTo({
      url: '/pages/notedetails/notedetails?id=' + this.data.publishId + '&uid=' + app.localUserData.user_id
    })
    this.noteFesetDataFun();
  },

  // by pdp
  shareToFriends: function () {
    this.onShareAppMessage();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options", options)
    var that = this;
    //判断用户等级，是否有权限发布现金产品
    if (app.localUserData.rids != 4) {
      that.setData({
        chargeArray: ['免费', '积分']
      })
    }
    //获取用于匹配的股票代码数据
    wx.request({
      url: 'https://share.romawaysz.com/static/upload/code.js',
      success: function (res) {
        var a = res.data
        var b = []
        for (var i = 0; i < a.length; i++) {
          var c = {
            name: a[i][3] + '(' + a[i][2] + ')',
            searchName: a[i][3] + '(' + a[i][2] + ')' + a[i][4],
            code: a[i][1]
          }
          b.push(c)
        }
        that.data.matchingStockCodeArray = b
      }
    })

    app.globalData.page = true
    app.globalData.scene += 1

    that.getPrice(1, 101)
    that.getDay(1, 31)
    that.getPeople(1, 100)
    that.getTime()
    that.getRise(3, 10)
    that.getStop()
  },
  // 选择匹配股票代码的方法
  setCodeFun: function (e) {
    var a = e.currentTarget.dataset.text
    var b = e.currentTarget.id
    this.setData({
      shareValue: a,
      shareCode: b
    })
  },

  //关联笔记 获取所有的笔记股票
  getNodeFun: function () {
    var that = this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/noteList',
      data: {
        id: app.localUserData.user_id,
        size: 30,
        area: 0,
        order: 'new',
        next: -1,
        index: -1,
        token: app.union_id,
        is_reach: -1
      },
      success: function (res) {

        var initResData = res.data.data;// 对象数组
        var initpickerNameArray = [];
        for (var i = 0; i < initResData.length; i++) {
          initResData[i].pickerName = initResData[i].share + ' 收益 ' + initResData[i].sum;
        }
        that.setData({
          nextPage: res.data.next,
          resNoteData: initResData
        })
        for (var i = 0; i < initResData.length; i++) {
          initpickerNameArray.push(initResData[i].pickerName);
        }
        initpickerNameArray.unshift("不关联");
        that.setData({
          pickerNameArray: initpickerNameArray
        })
        console.log(that.data.pickerNameArray);
        console.log(that.data.resNoteData);
      }
    })
  },

  //关联笔记 处理翻页
  //getMoreNodeFun :function (e) {
  // if (this.data.bufferResNoteData.length > this.data.dataSize) {
  //   this.getNodeFun();
  //   console.log(this.data.resNoteData);
  // }
  //console.log(e.detail)
  //},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.noteFesetDataFun();
    //this.getNodeFun();
    //this.getMoreNodeFun();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ nav: true });
    this.getNodeFun();
    //this.noteFesetDataFun()
    //this.viewFesetDataFun()    
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

  },

  //  转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '黑石笔记',
      path: '/pages/notedetails/notedetails?id=' + this.data.id + '&uid=' + app.localUserData.user_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})