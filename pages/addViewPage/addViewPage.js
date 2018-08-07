// pages/addViewPage/addViewPage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data:{
    content : '',
    title:'',
    id : 0,
    intro:'',
    price : 0,
    moneyType : 1
  },

  //获取补充观点的内容

  viewContent : function (e) {
    this.setData({
      content : e.detail.value
    })
  },

  //获取补充观点标题

  viewTitle : function (e) {
    this.setData({
      title : e.detail.value
    })
  },

  // 从缓存获取笔记id

  getNoteId : function () {
    var that = this;
    wx.getStorage({
      key: 'noteId',
      success: function (res) {
        console.log(res);
        that.setData({
          id: res.data
        })
      },
    })
  },

  //观点发布方法
  addView : function () {
    var that = this;
    var title= that.data.title;
    var intro = that.data.content.substring(0,29);
    var price=that.data.price;
    var moneyType= that.data.moneyType;
    var content= that.data.content;
    if (title == '') {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none',
        duration: 2000,
      })
      return false;
    } else if (content==''){
      wx.showToast({
        title: '发布内容不能为空',
        icon: 'none',
        duration: 2000,
      })
      return false;
    }
    //发布补充观点  
      wx.request({
        url: 'https://zhitouapi.romawaysz.com/view/create?token=' + app.union_id,
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          title:title,
          intro: intro,
          price:price, 
          type:moneyType,
          content:content
        },
        success: function (res) {
          console.log(res.data.data)
          var viewId = res.data.data.id;
          var note_Id = that.data.id;
          console.log('发布成功内容' + res);
          if (res.data.error == 0) {
            wx.showToast({
              title: '发布成功',
              duration : 1500
            })
            //关联笔记
            wx.request({
              url: 'https://zhitouapi.romawaysz.com/note/bindNoteView?view_id=' + viewId + "&note_id=" + note_Id + '&token=' + app.union_id,
              success: function (res) {
                if (res.data.error == 0) {
                  console.log("关联成功");
                  //回退到上一页
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
            
          }else {
            wx.showToast({
              title: '发布失败',
            })
          }
        }
      })
      
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
    this.getNoteId()
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
  
  }
})