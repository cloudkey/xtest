const app = getApp()
Page({
  data: {
    cats: [
    ],
    lastid: -1,
    cr: 0x000079,
    xtype: 1,
    typeDesc:[
      "完美型", "助人型", "成就型", "感觉型", "思考型", "忠诚型", "活跃型", "领袖型", "和平型",
    ],
    ready: false
  },

  onShow: function () {
    var xtype = ""
    try{
      xtype = wx.getStorageSync("myxtype")
    }catch(e){
      console.log("get storage for myxtype failed:",e)
    }
    
    if(xtype == ""){
      this.setData({
        ready: false
      })
      return
    }else{
      this.setData({
        ready: true
      })
    }

    console.log("myxtype:",xtype)

    var ncats = []
    var idx = 0
    this.loadDetail(xtype)
    ncats.push({
      id: idx++,
      open: false,
      head: "你的性格解析",
      key: xtype,
      self: true,
      detail1: "",
      detail2: "",
    })
    for (var i = 1; i < 10; i++) {
      if (i != xtype) {
        ncats.push({
          id: idx++,
          open: false,
          head: i + "号" + '(' + this.data.typeDesc[i - 1] + ')' +"人眼中的你",
          key: i + '-' + xtype,
          self: false,
          detail1: "",
          detail2: "",
        })
      }
    }
    this.setData({
      xtype: xtype,
      result: "恭喜，您属于第" + xtype + "类人格",
      cats: ncats,
    })
  },

  loadDetail: function (k) {
    console.log("getkey" + k)
    var detail = ""
    wx.getStorage({
      key: k,
      success: function(e){
      },
      fail: function () {
        console.log("fail")
        const requestTask = wx.request({
          url: app.url('desc/'),
          data: {
            name: k,
          },
          fail: function(){
            console.log("request failed")
          },
          success: function (res) {
            if (res.statusCode != 200) {
              console.log("get desc failed:",res)
              return
            }
            console.log(res.data)
            for (var i = 0; i < res.data.length; i++) {
              console.log(res.data[i][0])
              if (res.data[i][1] != ""){
                wx.setStorage({
                  key: res.data[i][0],
                  data: res.data[i][1],
                  fail: function (e) {
                    console.log("set storage failed: ",e)
                  }
                })

              }
            }
          }
        })
      }
    })
  },

  unfold: function (e) {
    var ncats = this.data.cats
    var cat = ncats[e.currentTarget.id]
    if (cat.open) {
      cat.cr = 0x000000
      cat.open = false
      ncats[e.currentTarget.id] = cat
      this.setData({
        cats: ncats,
      })
    }
    else {
      cat.cr = 0xAE0000
      cat.open = true
      if (cat.detail1 == "") {
        if(cat.self){
          cat.detail1 = wx.getStorageSync(cat.key)
        }else{
          cat.detail1 = wx.getStorageSync(cat.key + "-1")
          cat.detail2 = wx.getStorageSync(cat.key + "-2")
        }
        console.log(cat)
      }
      //
      ncats[e.currentTarget.id] = cat
      //
      if (this.data.lastid != -1 &&
        this.data.lastid != e.currentTarget.id &&
        ncats[this.data.lastid].open == true) {
        ncats[this.data.lastid].open = false
        ncats[this.data.lastid].cr = 0x000000
      }
      this.data.lastid = e.currentTarget.id
      this.setData({
        cats: ncats,
      })
    }
  },
  onShareAppMessage:function(options){

  }

})