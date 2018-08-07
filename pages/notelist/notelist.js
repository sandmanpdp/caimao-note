// pages/oxnotes/oxnotes.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 10,
    user_id:null,
    bottomState: true,
    notesNull: false,
    newPage: -1,
    newIndex: -1,
    hotPage: -1,
    hotIndex: -1,
    nullPage: -1,
    nullIndex: -1,
    maxPage: -1,
    maxIndex: -1,
    label: '',
    mask: false, //显示选项列表
    opt: true, //选择默认操作
    indexOne: 0, //默认选项一下标
    indexTwo: 0, //默认选项二下标
    optionOne:[ //选项列表1
      { text: '最新', label: 'new', state: false },
      { text: '热门', label: 'hot', state: false },
      { text: '0元', label: '0', state: false },
      { text: '最高', label: 'max', state: false }
    ],
    optionTwo: [ //选项列表2
      {text: '不限',label: '0', state: true},
      {text: '5%-10%',label: '0.05,0.1', state: false},
      {text: '11%-30%',label: '0.11,0.3', state: false},
      {text: '31%以上',label: '0.31,1', state: false}
    ],
    noteArray: [], //笔记列表
    multiArray: [['最新', '热门', '0元', '最高'], ['不限', '5%-10%', '11%-30%', '31%以上']]
  },
  // 默认选项选择方法
  defaultOptFun: function (e) {
    var id = e.currentTarget.id;
    if (id == 'headOne'){
      this.setData({
        mask: !this.data.mask,
        opt: true
      })
    }else{
      this.setData({
        mask: !this.data.mask,
        opt: false
      })
    }
  },
  // 列表选项选择方法
  optionOptFun: function (e) {
    if(this.data.opt){ //选项一
      this.setData({
        bottomState: true,
        notesNull: false,
        newPage: -1,
        newIndex: -1,
        hotPage: -1,
        hotIndex: -1,
        nullPage: -1,
        nullIndex: -1,
        maxPage: -1,
        maxIndex: -1,
        noteArray: []
      })
      var param = {};
      param['indexOne'] = e.currentTarget.dataset.index
      param['mask'] = false;
      var a = 'optionOne[' + this.data.indexOne + '].state';
      param[a]=false
      var b = 'optionOne[' + e.currentTarget.dataset.index + '].state';
      param[b] = true
      this.setData({
        indexTwo: 0
      })
    } else { //选项二
      var param = {};
      param['defaultTwo'] = this.data.optionTwo[e.currentTarget.dataset.index].text;
      param['mask'] = false;
      for (var i = 0; i < this.data.optionTwo.length; i++) {
        var a = 'optionTwo[' + i + '].state';
        if (i == e.currentTarget.dataset.index) {
          param[a] = true
        } else {
          param[a] = false
        }
      }
      this.setData({
        indexTwo: e.currentTarget.dataset.index
      })
      this.data.noteArray=[]
    }
    // 数据刷新
    this.setData({
      newPage: -1,
      newIndex: -1,
      hotPage: -1,
      hotIndex: -1,
      nullPage: -1,
      nullIndex: -1,
      maxPage: -1,
      maxIndex: -1
    })
    this.setData(param)
    var thisLabel = this.data.optionOne[this.data.indexOne]
    this.getOxNotes(thisLabel.label, thisLabel.text)
  },
  //获取笔记信息
  getOxNotes:function(a,b){
    var that = this
    var c
    var d
    if(a=='new'){
      c = that.data.newPage
      d = that.data.newIndex
    } else if (a == '0'){
      c = that.data.nullPage
      d = that.data.nullIndex
    }else if(a=='hot'){
      c = that.data.hotPage
      d = that.data.hotIndex
    }else{
      c = that.data.maxPage
      d = that.data.maxIndex
    }
    wx.request({
      url: 'https://zhitouapi.romawaysz.com/note/noteList',
      data: {
        size: that.data.size,
        next: c,
        order: a,
        area: that.data.optionTwo[that.data.indexTwo].label,
        index: d,
        token: app.union_id
      },
      success: function (res) {
        var d = res.data.data
        if(d != ""){
          if(d.length<that.data.size){
            var j=true
          }else{
            var j=false
          }
          var c = that.data.noteArray || []
          for(var i=0;i<d.length;i++) {
            c.push(d[i])
            c[c.length - 1]['day'] = app.getThisDay(d[i].created_at, d[i].work_date)
            if (d[i].is_look == -1 && d[i].price != 0 && d[i].is_reach ==-1 ){ //没看过 付费 进行中
              c[c.length - 1]['readOrbuyFun'] = 'buyFun'
            } else {
              c[c.length - 1]['readOrbuyFun'] = 'readFun'
            }
          }
          console.log(c);
          var e={}
          if(a=='0'){
            var f = 'nullPage'
            var g = 'nullIndex'
          }else{
            var f = a + 'Page'
            var g = a + 'Index'
          }
          e['notesNull']=j
          e['bottomState']=!j
          e['noteArray']=c
          e['label']=a
          e[f] = res.data.next
          e[g] = res.data.index
          that.setData(e)
        }else{
          var h = that.data.label
          if (h == "") {
            that.setData({
              notesNull: true,
              label: a,
              bottomState: false
            })
          }else{
            if (a == h) {
              that.setData({
                notesNull: true,
                label: a,
                bottomState: false,
                noteArray: that.data.noteArray || []
              })
            } else {
              that.setData({
                notesNull: true,
                label: a,
                bottomState: false,
                noteArray: []
              })
            }
          }
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
      url: '/pages/notebuy/notebuy?id=' + e.currentTarget.id.split("_")[1] + '&uid=' + e.currentTarget.dataset.uid
    })
  },

  // 阅读方法
  readFun: function (e) {
    console.log("readFun");
    var that = this;
    if (that.data.user_id != e.currentTarget.dataset.uid){
    
      wx.request({
        url: "https://zhitouapi.romawaysz.com/note/createRead",
        data: {
          sId: e.currentTarget.id.split("_")[1],
          type: 2,
          token: app.union_id
        },
        success: function (res) {

        }
      })
    }
    wx.navigateTo({
      url: '/pages/notedetails/notedetails?id=' + e.currentTarget.id.split("_")[1] + '&uid=' + e.currentTarget.dataset.uid
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.scene += 1
    app.globalData.page = true
    var a = options.type
    var b
    if (a == 'new'){
      b = 0
    } else if (a == 'hot'){
      b = 1
    } else if( a== '0'){
      b = 2
    }else{
      b = 3
    }
    var c = 'optionOne[' + b + '].state'
    var d={}
    d['indexOne']=b
    d[c]=true
    this.setData(d)
    this.getOxNotes(options.type)
    console.log(app.localUserData.user_id);
    this.setData({
      user_id: app.localUserData.user_id
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
    this.getOxNotes();
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

  //  当前页面下拉刷新
  onPullDownRefresh: function () {
    var that = this
    success: {
      that.setData({
        noteArray: [],
        bottomState: true,
        notesNull: false,
        newPage: -1,
        newIndex: -1,
        hotPage: -1,
        hotIndex: -1,
        nullPage: -1,
        nullIndex: -1,
        maxPage: -1,
        maxIndex: -1,
      })
      var thisLabel = that.data.optionOne[that.data.indexOne]
      that.getOxNotes(thisLabel.label, thisLabel.text)
      setTimeout(function(){wx.stopPullDownRefresh()}, 500)
    }
  },

  //  页面上拉触底事件的处理函数
  onReachBottom: function () {
    var thisLabel = this.data.optionOne[this.data.indexOne]
    this.getOxNotes(thisLabel.label, thisLabel.text)
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