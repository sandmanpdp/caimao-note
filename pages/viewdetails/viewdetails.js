//获取应用实例
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 10,
    commentNull:false,
    followState: false,  //关注状态
    maskState: false,
    id: null,  //观点id
    viewArray: [],  //观点详情数组
    commentArray: [],  //评论详情数组
    listValue: 0,  //全部评论的总数
    buyState: false,  //购买状态
    commentPage: -1,  //评论页码
    commentValue: null,  //我的评论
    maskRewardState: false,  //是否显示打赏遮罩
    maskRewardIndex: 0,  //上一次打赏金额下标
    maskRewardArray: [  //打赏金额数组
      { price: 1000, state: true },
      { price: 400, state: false },
      { price: 200, state: false },
      { price: 100, state: false },
      { price: 60, state: false },
      { price: 20, state: false }
    ],
    profitInfo: null,//收益数据
    moreProfitInfo: false,
    profitNum : 0,
    priceArray: [1, 0, 0],  //渲染价格图片的数组
    viewId : 0,
    relatedShareName:'',
    relatedShareId:0,
    isRelated : false,
    user_id : 0
  },
  getViewDataFun: function () {  //获取观点数据
    var that = this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/view/detail',
      data: {
        id: that.data.id,
        token: app.union_id
      },
      success: function (res) {
        var a = res.data.data
        var b
        var c
        var d = a.price.split('')
        if (a.is_read == 1) {
          b = true
        } else {
          b = false
        }
        if (a.is_concern==1){
          c=true
        }
        that.setData({
          viewArray: a,
          buyState: b,
          followState: c,
          priceArray: d,
          viewId : res.data.data.id
        })
        that.getRelatedNote();
      }
    })
    //获取打赏数据
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/purse/detail',
      data: {
        size: 7,
        next: -1,
        token: app.union_id,
        pro_id: that.data.id,
        pro_way: 6,
        sum: 1,
        pro_type : 1
      },
      success: function (res) {
        console.log(res.data.data)

        var moreProfitInfo = false;
        if (res.data.data.length > 7) {
          moreProfitInfo = true;
        } else {
          moreProfitInfo = false
        }
        that.setData({
          profitInfo: res.data.data,
          moreProfitInfo: moreProfitInfo,
          profitNum: res.data.total
        })
      }
    })
  },
  getCommentDataFun: function () {  //获取评论数据
    var that = this
    wx.request({  
      url: 'https://zhitouapi.romawaysz.com/comment/list',
      data: {
        type: 1,
        size: that.data.size,
        id: that.data.id,
        next: that.data.commentPage,
        token: app.union_id
      },
      success: function (res) {
        var a=res.data.data
        if (a != "") {
          if (a.length < that.data.size){
            var b=true
          }
          var c = that.data.commentArray || []
          for(var i=0;i<a.length;i++){
            c.push(a[i])
          }
          that.setData({
            commentArray: c,
            commentNull: b,
            commentPage: res.data.next
          })
        }else{
          if (that.data.viewArray.comment==0){
            that.setData({
              commentNull: false
            })
          }
        }
      }
    })
  },
  getCommentFun: function(){  //发送评论内容
    var that = this
    if (that.data.commentValue) {
      wx.request({
        url: 'https://zhitouapi.romawaysz.com/comment/create',
        data: {
          type: 1,
          id: that.data.id,
          content: that.data.commentValue,
          token: app.union_id
        },
        success: function (res) {
          if (res.data.error == 0) {
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
            var a = "viewArray.comment"
            var b = parseInt(that.data.viewArray.comment) + 1
            var c = {}
            c[a] = b
            c['maskState'] = false
            c['commentValue'] = null
            c['commentArray'] = []
            c['commentPage'] = -1
            c['commentNull'] = false
            setTimeout(function () {
              that.setData(c)
              
              that.getCommentDataFun()
            }, 1000)
          }
        }
      })
    }else {
      wx.showToast({
        title: '评论内容不能为空',
        icon : 'none'
      })
    }
  },

  linkRewardUserPage: function () {
    wx.navigateTo({
      url: '/pages/profitPage/profitPage?pro_type=1&id=' + this.data.id
    })
  },

  linkUserFun: function (e) {  //跳转达人主页
    wx.navigateTo({
      url: '/pages/master/master?id=' + e.currentTarget.id
    })
  },
  
  bindCommentInput: function (e) {  //评论获取方法
    this.setData({
      commentValue: e.detail.value
    })
  },
  setMaskFalseFun: function(){  //关闭遮罩
    this.setData({
      maskState: false
    })
  },
  setMaskTrueFun: function () {  //打开遮罩
    this.setData({
      maskState: true
    })
  },
  followFun: function(e){  //关注方法
    app.masterFollowFun(e.currentTarget.id, this)
  },
  setLaudFun: function(e){  //观点点赞方法
    var that = this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/praise/create',
      data: {
        type: 1,
        user_id: app.localUserData.user_id,
        sId: that.data.id,
        token: app.union_id
      },
      success: function (res) {
        if (res.data.error == 0) {
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })
          that.getViewDataFun()
        }else {
          wx.showToast({
            title: '已点过赞',
            icon:'none'
          })
        }
      }
    })
  },
  openRewardMaskFun: function (e) {  //打开打赏遮罩
    this.setData({
      maskRewardState: true
    })
  },
  closeRewardMaskFun: function (e) {  //关闭打赏遮罩
    this.setData({
      maskRewardState: false
    })
  },
  choiceRawardSumFun: function (e) {  //选择打赏金额
    var that = this
    var a = e.target.dataset.index
    var b = {}
    b['maskRewardArray[' + a + '].state'] = true
    b['maskRewardArray[' + that.data.maskRewardIndex + '].state'] = false
    b['maskRewardIndex'] = a
    that.setData(b)
  },
  sendRawardSumFun: function (e) {  //发送打赏金额
    var that = this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/purse/createReward',
      data: {
        type: 1,
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
          that.getViewDataFun();
        } else if (res.data.error == 10080){
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
  commentLaudFun: function(e){  //评论点赞
    var that=this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/praise/create',
      data: {
        type: 3,
        user_id: app.localUserData.user_id,
        sId: e.currentTarget.id,
        token: app.union_id
      },
      success: function (res) {
        if (res.data.error == 0) {
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 1000
          })
          
          var a = "commentArray[" + e.currentTarget.dataset.index +"].praise"
          var b = parseInt((that.data.commentArray[e.currentTarget.dataset.index]).praise)+1 ;


          var is_praise = "commentArray[" + e.currentTarget.dataset.index + "].is_praise"
          var thumbed = that.data.commentArray[e.currentTarget.dataset.index].is_praise = 1;
          var setVal = {};
          setVal[is_praise] = thumbed;
          that.setData(setVal)

          var c = {}
          c[a] = b
          that.setData(c);
          that.getViewDataFun();
        }else {
          wx.showToast({
            title: '已点过赞',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  //获取关联笔记
  getRelatedNote :function () {
    var that = this;
    var view_id = that.data.viewId;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/linkNoteView?token='+app.union_id,
      data:{
        view_id: view_id //id
      },
      success (res) {
        var resDataArray = res.data.data;
        console.log(resDataArray);
        if (resDataArray.length > 0 ) {
          that.setData({
            relatedShareName: resDataArray[0].title,
            relatedShareId: resDataArray[0].id,
            isRelated : true,
            user_id: resDataArray[0].user_id
          })
        } else if (resDataArray.length == 0 ) {
          that.setData({
            isRelated: false
          })
        }
      }
    })
  },
  //跳转到关联的笔记
  toRelatedNote : function (e) {
    wx.navigateTo({
      url: '/pages/notedetails/notedetails?id=' + e.currentTarget.id + '&uid=' + e.currentTarget.dataset.uid
    })
  },

  //购买方法
  buyFun: function (e) {
    var that = this

    wx.request({
      url: "https://zhitouapi.romawaysz.com/note/createRead",
      data: {
        sId: that.data.id,
        type: 1,
        token: app.union_id
      },
      success: function (res) {
        var a=res.data.error
        if (a == 0) {
          that.setData({
            buyState: true
          })
          wx.redirectTo({
            url: '/pages/viewdetails/viewdetails?id=' + that.data.viewArray.id + '&uid=' + that.data.viewArray.user_id
          })
        } else if (a == 10080) {
          wx.showToast({
            title: '余额不足',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }else{
          wx.showToast({
            title: a,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getViewDataFun();
    this.getCommentDataFun();
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
      that.getViewDataFun()
      that.getCommentDataFun()
      setTimeout(function () { wx.stopPullDownRefresh() }, 500)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCommentDataFun()
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
      path: '/pages/viewdetails/viewdetails?id=' + that.data.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  } 
})