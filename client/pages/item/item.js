//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    items: [],
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    if (e.detail.value["sel"].length == 0) {
      wx.showModal({
        title: "您还没有任何选择哦",
        confirmText: "确定",
      })
      return
    }

    var hash = new Array()
    var maxid = 1
    var max = 0
    for (var i = 0; i < e.detail.value["sel"].length; i++) {
      var v = e.detail.value["sel"][i]
      if (hash[v] != undefined) {
        hash[v] = hash[v] + 1
      } else {
        hash[v] = 1
      }
      if (hash[v] > max) {
        max = hash[v]
        maxid = v
      }
    }

    //
    wx.setStorage({
      key: 'myxtype',
      data: maxid,
      fail: function (e) {
        console.log("set storage for myxtype failed:", e)
      }
    })
    //
    if(app.globalData.userInfo){
      wx.request({
        url: app.url('put_result/'),
        data: {
          name: app.globalData.userInfo.nickName,
          xtype: maxid,
          head: app.globalData.userInfo.avatarUrl
        },
        success: function (res) {
          if (res.statusCode == 200) {
            console.log("put result success")
          } else {
            console.log("put result failed:" + res.data)
          }
        },
        fail: function (e) {
          console.log("put result failed:" + e)
        }
      })

    }
    //
    this.loadDetail(maxid)
    //
/*    
    var nexturl = '../result/result?data=' + maxid
    console.log(nexturl)
    wx.navigateTo({
      url: nexturl,
    })
    */
  },
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      items: getApp().data.quests
    })
  },
  loadDetail: function (k) {
    console.log("getkey" + k)
    var ready = false
    wx.getStorage({
      key: k,
      success: function (e) {
        ready = true
        var nexturl = '../result/result?data=' + k
        console.log(nexturl)
        wx.navigateTo({
          url: nexturl,
        })
      },
      fail: function () {
        console.log("get storage fail")
        const requestTask = wx.request({
          url: app.url('desc/'),
          data: {
            name: k,
          },
          fail: function () {
            console.log("request failed")
            wx.navigateTo({
              url: "../err/err",
            })
          },
          success: function (res) {
            if (res.statusCode != 200) {
              console.log("get desc failed:", res)
              wx.navigateTo({
                url: "../err/err",
              })
              return
            }
            console.log(res.data)
            for (var i = 0; i < res.data.length; i++) {
              console.log(res.data[i][0])
              if (res.data[i][1] != "") {
                wx.setStorage({
                  key: res.data[i][0],
                  data: res.data[i][1],
                  fail: function (e) {
                    console.log("set storage failed: ", e)
                  },
                  success:function(e){
                  }
                })
              }
            }
            ready = true
            var nexturl = '../result/result?data=' + k
            console.log(nexturl)
            wx.navigateTo({
              url: nexturl,
            })
          }
        })
      }
    })
  }
})
