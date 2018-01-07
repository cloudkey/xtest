const app = getApp()
Page({
  data: {
    notes: [
      { "note": "如果做好心理准备,一切准备都已经完成。", "author": "莎士比亚" },
      { "note": "谁懂得了为什么生活，谁就能承受任何一种生活。", "author": "尼采" },
      { "note": "好的人生是一种过程，而不是一种静止的状态，它是一个方向，而不是一个终点。", "author": "罗杰斯" },
      { "note": "在人前我们总是习惯于伪装自己，但最终也蒙骗了自己。", "author": "弗朗索瓦德" },
      { "note": "走得最慢的人，只要他不丧失目标，也比漫无目的地徘徊的人走得快。", "author": "莱辛" },
      { "note": "人们最终所真正能够理解和欣赏的事物，只不过是一些在本质上和他自身相同的事物罢了。", "author": "叔本华" },
      { "note": "野蛮人互相吞吃对方，文明人则互相欺骗对方。", "author": "叔本华" },
      { "note": "完全不谈自己是一种甚为高贵的虚伪。", "author": "尼采" },
      { "note": "在孤独中，孤独者将自己吃得一干二净，而在群体中，他被众人吃掉。", "author": "尼采" },
      { "note": "如果是为了我自己 仅仅是我自己，那生活毫无意义。", "author": "海伦•帕尔默" },
    ],
    typeDesc: [
      "完美型", "助人型", "成就型", "感觉型", "思考型", "忠诚型", "活跃型", "领袖型", "和平型",
    ],
    users:[
    ],
    usersPage: 0,
    pageEnd : false,
    scrollLeft: 0,
    loaddingUsers: false,
    lastScrollLowerTime: 0
  },
  onLaunch: function () {
    wx.setStorageSync('logs', 'login')
  },
  startTest: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    const requestTask = wx.request({
      url: app.url('item'),
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.hideLoading()
          wx.navigateTo({
            url: '../err/err',
          })
          return
        }
        var tmp = []
        for (var j = 0; j < res.data.length; j++) {
          tmp.push({ value: res.data[j][0], content: res.data[j][1], })
        }
        getApp().data.quests = tmp
        wx.hideLoading()
        wx.navigateTo({
          url: '../item/item',
        })
      },
      fail: function (e) {
        wx.hideLoading()
        wx.navigateTo({
          url: '../err/err',
        })
      },
      complete: function(e){
        wx.hideLoading()
      }
    })
  },
  onShareAppMessage: function (options) {

  },
  /* onLaunch: function () {
     console.log("startLogin")
     wx.login({
       success: function (res) {
         console.log("login code:",res.code)
         if (res.code) {
           //发起网络请求
           wx.request({
             url: 'https://test.com/onLogin',
             data: {
               code: res.code
             }
           })
         } else {
           console.log('获取用户登录态失败！' + res.errMsg)
         }
       },
       fail:function(e){
         console.log("get login code failed:",e)
       }
     });
   }
   */
  loadUsers:function(init){
    console.log("init: ", init)
    if(init == undefined){
      init = false
    }
    if(init){
      this.data.usersPage = 0,
      this.data.pageEnd = false
    }
    if (this.data.loaddingUsers){
      console.log("loadding users in process: ", this.data.usersPage)
      return
    }
    console.log("begin request")
    var curPage = this.data.usersPage
    var that = this
    this.data.loaddingUsers = true
    console.log("curPage:",curPage)
    wx.request({
      url: app.url('get_result/'),
      data: {
        page: curPage
      },
      success:function(res){
        that.data.loaddingUsers = false
        if(res.statusCode != 200){
          console.log("get result failed:",res.data)
          return
        }
        console.log("get result success:",res.data)
        if(res.data.length==0){
          console.log("get result: empty data")
          return
        }
        that.data.usersPage++
        if (res.data.length < 10){
          that.data.pageEnd = true
        }
        var nusers = that.data.users
        if(init){
          nusers = []
        }
        for(var i = 0; i < res.data.length; i++){
          var item = res.data[i]
          console.log("item:",item)
          var shortName = item[0]
          var shortLen = 5
          if (escape(shortName).indexOf("%u") != -1) {
            shortLen = 3;
          }
          if (shortName.length > shortLen){
            shortName = shortName.substr(0, shortLen-1)+'~'
          }
          nusers.push({
            name: shortName,
            xtype: item[1],
            head: item[2]
          })
        }
        that.setData({
          users: nusers
        })
        if(init){
          console.log("set scroll left 0")
          that.setData({
            scrollLeft: 0
            
          })
        }
      },
      fail:function(e){
        console.log("get result failed:",e)
        that.data.loaddingUsers = false
      }
    })
  },
  scrollToLower:function(){
    var mTime = Date.now()
    if(mTime - this.data.lastScrollLowerTime < 1000){
      this.data.lastScrollLowerTime = mTime
      return
    }
    this.data.lastScrollLowerTime = mTime
    if(!this.data.pageEnd){
      this.loadUsers(false)
    }
  },
  onLoad: function () {
    var idx = Date.now() % this.data.notes.length
    console.log(idx)
    var anote = this.data.notes[idx]
    this.setData({
      note: anote["note"],
      author: anote["author"],
    }),
    this.scrollToLower()
  },
  onPullDownRefresh: function(){
    wx.showNavigationBarLoading()

    setTimeout(function(){
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1000)

    this.loadUsers(true)
  }
})