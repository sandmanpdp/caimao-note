//获取应用实例
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    option: [],
    buyState: false,  //是否已购买
    buyEndState: false, //支付（购买时间截止状态）
    rewardEndState: false, //打赏购买结束状态
    maskCueState: false,
    followState: false,  //关注状态
    maskRewardState: false,  //是否显示打赏遮罩
    maskRewardIndex: 0,  //上一次打赏金额下标
    maskRewardArray:[  //打赏金额数组
      {price: 50*20, state: true},
      { price: 20 * 20, state: false},
      { price: 10 * 20, state: false},
      { price: 5 * 20, state: false},
      { price: 3 * 20, state: false},
      { price: 1 * 20, state: false}
    ],

    id: null,  //笔记id
    uid: null,  //作者id
    myid: null,  //我的id
    // vip: true,  //等级
    profitNum : 0,
    userInfo: [],  //用户信息
    noteInfo: [],  //笔记信息
    priceArray: [1, 0, 0],  //渲染价格图片的数组
    targetDay: 0,  //目标时间
    endDay: 0,  //阅读截止时间
    actualDay: '*',  //实际时间
    targetPrice: 0,  //目标价
    startPrice: 0,  //起算价
    stopPrice: 0,  //止损价
    newPrice: 0,  //最新价
    actualTop: '*',  //实际涨幅
    created_at: 0,  //预期开始年月日
    work_date: 0,  //预期结束年月日

    readInfo: null, //阅读数据
    profitInfo : null,//收益数据
    moreProfitInfo : false,
    readState: false,  //是否省略显示阅读头像
    isWorkDate :true,//by pdp
    isSub:false,//是否已订阅 by pdp
    noSubNote:'',// by pdp
    hook_price:0,// by pdp
    total_reward : 0,//by pdp
    income : 0 , //by pdp
    sign : '',
    relatedView:null,
    isRelatedView:false,
    look : 0,
    need_price:0,
    is_reach : false,//判断笔记广场和补充观点用
    isReach: 0,//判断笔记收益 达标未达标
    logic: [] , //逻辑详情
    limit_day:0  //限时
  },

  linkUserFun: function(e){  //跳转达人主页
    wx.navigateTo({
      url: '/pages/master/master?id=' + e.currentTarget.id
    })
  },

  linkRewardUserPage : function () {
    wx.navigateTo({
      url: '/pages/profitPage/profitPage?pro_type=2&id='+this.data.id
    })
  },

  fansLinkFun: function (e) {  // 粉丝列表跳转方法
    wx.navigateTo({
      url: '/pages/fans/fans?id=' + e.currentTarget.id
    })
  },
  masterFollowFun: function (e) {  // 关注用户方法
    app.masterFollowFun(e.currentTarget.id,this)
  },
  openRewardMaskFun: function (e) {  //打开打赏遮罩
    this.setData({
      maskRewardState: true
    })
  },
  closeRewardMaskFun: function(e){  //关闭打赏遮罩
    this.setData({
      maskRewardState: false
    })
  },
  openCueMaskFun: function (e) {  //打开支付遮罩
    this.setData({
      maskCueState: true
    })
  },
  closeCueMaskFun: function (e) {  //关闭支付遮罩
    this.setData({
      maskCueState: false
    })
  },
  choiceRawardSumFun: function(e){  //选择打赏金额
    var that=this
    var a = e.target.dataset.index
    var b={}
    b['maskRewardArray['+ a +'].state']= true
    b['maskRewardArray['+ that.data.maskRewardIndex +'].state']= false
    b['maskRewardIndex'] = a
    this.setData(b)
  },
  sendRawardSumFun: function (e) {  //发送打赏金额
    var that = this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/purse/createReward',
      data: {
        type: 2,
        way: 1,
        sId: that.data.id,
        price: that.data.maskRewardArray[that.data.maskRewardIndex].price,
        token: app.union_id
      },
      success: function (res) {
        if (res.data.error == 0) {
          wx.showToast({
            title: '打赏成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })
          that.closeRewardMaskFun();
          that.getData()
        } else if (res.data.error == 10080) {
          wx.showToast({
            title: '余额不足',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  },
  buyFun: function(e){  //购买笔记
    var that = this
    wx.request({
      url: "https://zhitouapi.romawaysz.com/note/createRead",
      data:{
        sId: e.currentTarget.id,
        type: 2,
        token: app.union_id
      },
      success:function(res){
        if (res.data.error==0){
          that.setData({
            buyState: true
          });
          wx.redirectTo({
            url: '/pages/notedetails/notedetails?id=' + that.data.option.id + '&uid=' + that.data.option.uid
          })
        } else if (res.data.error == 10080){
          wx.showToast({
            title: '余额不足',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }else if (res.data.error == 10092) {
          wx.showToast({
            title: '超过阅读人数限制',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }else{
          wx.showToast({
            title: res.data.error,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      }
    })
  },

  getData:function(){
    var that = this
    var option = that.data.option
    wx.request({  //获取用户数据
      url: 'https://zhitouapi.romawaysz.com/account/otherUserInfo',
      data: {
        id: option.uid,
        token: app.union_id
      },
      success: function (res) {
        var a
        if (res.data.data.is_concern == 1) {
          a = true
        } else {
          a = false
        }
        that.setData({
          id: option.id,
          uid: option.uid,
          myid: app.localUserData.user_id,
          userInfo: res.data.data,
          followState: a
        })

        if (that.data.userInfo.sign) {
          that.setData({
            sign: that.data.userInfo.sign
          })
        }else {
          that.setData({
            sign: '这个人很懒，什么都没有留下'
          })
        }

        wx.setStorage({
          key: 'note_Id',
          data: option.id,
        })
      }
    })
    
    wx.request({  //获取笔记数据
      url: 'https://zhitouapi.romawaysz.com/note/detail',
      data: {
        id: option.id,
        token: app.union_id
      },
      success: function (res) {
        var income = 0;
        var a = res.data.data;
        console.log(a);
        var b = a.need_price.split('')
        var d = app.getThisDay(a.created_at, a.work_date);
        var endDay;
        if(a.is_reach == -1){
          endDay = app.getThisDay(a.created_at, a.work_date) + '天'
        }else {
          endDay = '已结束'
        }
      
        if (a.limit_date == '2038-01-01 00:00:00') {
          var e = '不限制阅读时间'
        } else if (app.getThisDay(res.data.time, a.limit_date) <= 0){
          var e = '订阅时间已截止'
        }else {
          var e = app.getThisDay(res.data.time, a.limit_date) + '天后不能订阅'
        }
        var m
        if (e <= 0) {
          e = 0
          var l = true
          m = true
        }
        var f = []
        f.push(parseFloat(a.in_price))
        f.push(parseFloat(a.rise))
        f.push(parseFloat(a.fall))
        var g = (f[0] * (100 + f[1]) / 100).toFixed(2)
        var h = (f[0] * (100 - f[2]) / 100).toFixed(2)
        var i = f[0].toFixed(2)
        if (a.is_read == 0) {
          var k = false
        } else {
          m = false
          var k = true
          if(a.is_reach == -1) {
            var j = app.getThisDay(a.created_at, res.data.time);
          }else {
            var j = app.getThisDay(a.created_at, a.work_date);
          }
         
        }
        if (a.user_id == app.localUserData.user_id) {
          m = true
        }
        that.setData({
          noteInfo: a,
          priceArray: b,
          targetDay: d,
          endDay: endDay,
          limit_day : e,
          targetPrice: g,
          stopPrice: h,
          startPrice: i,
          actualDay: j,
          buyState: k,
          buyEndState: l,
          rewardEndState: m,
          created_at: ((a.created_at).split(' '))[0],
          work_date: ((a.work_date).split(' '))[0],
          hook_price: a.hook_price,
          total_reward: parseInt(a.total_reward),
          look :a.look,
          need_price: a.need_price
        })
        if (a.is_read != 0) {
          if( a.is_reach == -1 ) {
            that.getSharePricesFun(that)
          }else{
            that.getNewSharePrice(that);
            that.setData({
              actualTop: ((a.out_price - a.in_price) / a.in_price * 100).toFixed(2)
              //TODO 实际涨幅为笔记结束时涨幅 
            })
          }
        }

        // 判断是否显示补充观点按钮
        if (a.is_reach == -1) {
          that.setData({
            is_reach : true
          }) 
        }
        if (a.is_reach == -1 || a.is_reach == 1) {
          income = a.look * a.need_price;
        } else if (a.is_reach == 0) {
          income = -a.need_price;
        }
        that.setData({
          income: income,
          isReach: a.is_reach
        })
      }
    })
    //that.isWorkDate();
    wx.request({  //获取笔记阅读数据
      url: 'https://zhitouapi.romawaysz.com/note/noteLookList',
      data: {
        id: option.id,
        next: -1,
        token: app.union_id
      },
      success: function (res) {
        var a = res.data.data
        var b = []
        for (var i = 0; i < a.length && i < 9; i++) {
          b.push(a[i])
        }
        var c
        if (a.length < 7) {
          c = false
        } else {
          c = true
        }
        that.setData({
          readInfo: b,
          readState: c
        })
      }
    });

    // 获得打赏列表
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/purse/detail',
      data : {
        size :7,
        next :-1,
        token : app.union_id,
        pro_id: that.data.option.id,
        pro_way:6,
        sum : 1,
        pro_type : 2
      },
      success:function (res) {
        console.log(res.data.data)

        var moreProfitInfo = false;
        if (res.data.data.length>7){
          moreProfitInfo = true;
        }else {
          moreProfitInfo = false
        }
        that.setData({
          profitInfo : res.data.data,
          moreProfitInfo: moreProfitInfo,
          profitNum: res.data.total
        })
      }
    })
    wx.request({  // 逻辑获取方法
      url: 'https://zhitouapi.romawaysz.com/note/noteViewList',
      data: {
        id: option.id,
        token: app.union_id
      },
      success: function (res) {
        // if (res.data.error == 0) {
        //   var a = res.data.data;
        //   console.log(a);
        //   var b = ''
        //   for (var i = 0; i < a.length; i++) {
        //     b += a[i].content
        //   }
        // } else if (res.data.error == 10000) {
        //   var b = '订阅后可查看推荐理由'
        // }
        // that.setData({
        //   logic: b
        // })

        if (res.data.error == 0) {
          var logicContent = res.data.data;
          console.log(logicContent);
          that.setData({
            logic: logicContent,
            isSub : true
          })
        } else if (res.data.error == 10000){
          that.setData({
            noSubNote: '订阅后可查看推荐理由'
          })
        }

      }
    })
  },

  //关联观点 详情
  relatedViewDetail : function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/viewdetails/viewdetails?id=' + id,
    })
  },

  //点击头像跳转到个人中心页面
  toMasterPage : function () {
    wx.navigateTo({
      url: '/pages/master/master?id=' + this.data.uid
    })
  },
  //笔记广场
  toNoteList : function () {
    wx.navigateTo({
      url: '/pages/notelist/notelist?type=hot'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options' + options)
    this.setData({
      option: options
    })
    this.getData()
  },

  getSharePricesFun: function (a) {  //获取股票现价
    wx.request({  
      url: 'https://zhitouapi.romawaysz.com/note/getSharePrices?token=' + app.union_id,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        code: a.data.noteInfo.scode
      },
      success: function (res) {
        var b = parseFloat(res.data.data[0].S_Price)
        var c = a.data.noteInfo.in_price
        a.setData({
          newPrice: b.toFixed(2),
          actualTop: ((b - c) / c * 100).toFixed(2)
        })
      }
    })
  },

  getNewSharePrice:function(a) {
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/getSharePrices?token=' + app.union_id,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        code: a.data.noteInfo.scode
      },
      success: function (res) {
        var b = parseFloat(res.data.data[0].S_Price)
        a.setData({
          newPrice: b.toFixed(2)
        })
      }
    })
  },

  addViewFun: function (e) {
    wx.navigateTo({
      url: '/pages/addViewPage/addViewPage',
    })
  },

  //逾期不可补充笔记
  isWorkDate : function () {
    var str = this.data.work_date;
    str = str.replace(/-/g, "/");
    var date = new Date(str);
    var now = new Date();
    if(date < now) {
      this.setData({
        isWorkDate : false
      })
    } else {
      this.setData({
        isWorkDate: true
      })
    }
  },

  //获取关联观点的内容
  getRelatedView : function () {
    var that = this;
    var option = that.data.option;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/linkNoteView?token=' + app.union_id,
      data : {
        note_id: option.id
      },
      success : function (res) {
        console.log(res.data);
        if (res.data.data.length > 0){
          console.log("关联观点内容"+res.data.data)
          that.setData({
            relatedView: res.data.data,
            isRelatedView: true
          })
        }
      }
    })
  },

  //跳到阅读详情页
  linkReadUserPage : function () {
    wx.navigateTo({
      url: '/pages/readUserPage/readUserPage?id=' + this.data.id,
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getRelatedView();
    this.getData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
    this.getRelatedView();
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

  //当前页面下拉刷新
  onPullDownRefresh: function () {
    var that = this
    success: {
      that.getData()
      setTimeout(function () { wx.stopPullDownRefresh() }, 500)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  //  转发
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '黑石笔记',
      path: '/pages/notedetails/notedetails?id=' + that.data.id + '&uid=' + that.data.uid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  } 
})