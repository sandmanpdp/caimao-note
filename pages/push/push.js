var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    end_note:null,
    new_fans : null,
    new_note : null,
    new_view : null,
    note_hot : null,
    note_reply : null,
    read_comment_note : null,
    read_note_view : null,
    reward : null
  },

  switchChange: function (e) {
    var option = e.currentTarget.id;
    console.log(e, e.currentTarget.id)
    var a = e.detail.value
    if(a==true){
      wx.request({
        url: 'https://zhitouapi.romawaysz.com/app/modifyOptionSet',
        data: {
          option: option,
          state: 1,
          token: app.union_id
        },
        success: function (res) {
          if(res.data.error==0){
            wx.showToast({
              title: '开启成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
          }         
        }
      })
    }else{
      wx.request({
        url: 'https://zhitouapi.romawaysz.com/app/modifyOptionSet',
        data: {
          option: option,
          state: 0,
          token: app.union_id
        },
        success: function (res) {
          if (res.data.error == 0) {
            wx.showToast({
              title: '关闭成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
          }       
        }
      })
    }
  },

  //获取所有开关状态
  getOptionSet : function () {
    var that = this;
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/app/optionSet?token=' + app.union_id,
      success : function (res) {
        console.log(res.data[0]);
        that.setData({
          end_note: res.data[0].end_note,
          new_fans: res.data[0].new_fans,
          new_note: res.data[0].new_note,
          new_view: res.data[0].new_view,
          note_hot: res.data[0].note_hot,
          note_reply: res.data[0].note_reply,
          read_comment_note: res.data[0].read_comment_note,
          read_note_view: res.data[0].read_note_view,
          reward: res.data[0].reward
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/app/optionSet',
      data: {
        token: app.union_id
      },
      success: function(res){
        that.setData({
          array: res.data.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getOptionSet();
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