const app = getApp()

Page({
  data: {
    items: [{
      "id":"12345",
      "lz_icon":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI3akK1B…5gkbM0TBic7Pol93auZqQH08vM9oYOSPrly0tiarKFEHfCA/0",
      "lz_name":"Shorley",
      "zan_cnt":"120",
      "content":"很好的一款软件",
      "date":"2018-08-02 15:23:44",
      "reply":[{
        "name":"xuwei",
        "content":"说得好"
      },]
    },
      {
        "id": "12345",
        "lz_icon": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI3akK1B…5gkbM0TBic7Pol93auZqQH08vM9oYOSPrly0tiarKFEHfCA/0",
        "lz_name": "Shorley",
        "zan_cnt": "120",
        "content": "很好的一款软件",
        "date": "2018-08-02 15:23:44",
        "reply": []
      },],
    cur_comment: ""
  },
  onLoad: function (options) {
    var that = this
    const requestTask = wx.request({
      url: app.url('get_comment/'),
      data: {
        id: 0,
        down: 0
      },
      success: function (res) {
        if(res.data.length == 0)
          return;        
        that.setData({
          items: res.data
        })
      }
    })
  },

  sendComment : function(options) {
    console.log(options)
    var userName = "无名氏";
    var userHead = "null"
    var that = this
    if(app.globalData.userInfo){
      userName = app.globalData.userInfo.nickName;
      userHead = app.globalData.userInfo.avatarUrl;
    }

    const requestTask = wx.request({
      url: app.url('put_comment/'),
      data: {
        name: userName,
        parent_id: -1,
        content:options.detail.value["comment"],
        head:userHead,
      },
      success: function (res) {
        var topId = that.data.items[0].id
        const requestTask = wx.request({
          url: app.url('get_comment/'),
          data: {
            id: topId,
            down: 0
          },
          success: function (res) {
            if (res.data.length == 0)
              return;
            var nitems = res.data.concat(that.data.items)
            that.setData({
              items: nitems,
              cur_comment: ""
            })
          }
        })
      }
    })
  },
  
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()

    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1000)

    var that = this
    var topId = that.data.items[0].id
    const requestTask = wx.request({
      url: app.url('get_comment/'),
      data: {
        id: topId,
        down: 0
      },
      success: function (res) {
        if (res.data.length == 0)
          return;
        var nitems = res.data.concat(that.data.items)
        that.setData({
          items: nitems
        })
      }
    })
  }
})