var app = getApp();
function getFollowers(options) {
  var that = this;
  var obj = new Object();
  wx.request({
    url: 'https://zhitouapi.romawaysz.com/account/concernList',
    data: {
      id: options.id,
      size: options.num,
      page: 1,
      token: app.union_id
    },
    success: function (res) {
      var a = res.data.data
      if (a == "") {
        var b = true
      } else {
        var b = false
      }
      
      obj.similarArray = a;
      obj.similarValue = a;
      obj.nullState = b;
      // that.setData({
      //   similarArray: a,
      //   similarValue: a,
      //   nullState: b
      // })
    }
    
  })
  return obj;
}

function test(name) {
  
}


module.exports.getFollowers = getFollowers;
