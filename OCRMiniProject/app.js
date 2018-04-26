//app.js
App({
    onLaunch: function() {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        var self = this;
        // 登录
        wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    wx.request({
                        url: self.globalData.host + 'userInfo',
                        data: {
                            code: res.code
                        },
                        success: function(res) {
                            self.userInfo = res.data;
                            console.log(self.userInfo.openid);
                        }
                    })
                }
            }),
            // 获取用户信息
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        wx.getUserInfo({
                            success: res => {
                                // 可以将 res 发送给后台解码出 unionId
                                this.globalData.userInfo = res.userInfo
                                console.log("res.userInfo" + res.userInfo);
                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                // 所以此处加入 callback 以防止这种情况
                                if (this.userInfoReadyCallback) {
                                    this.userInfoReadyCallback(res)
                                }
                            }
                        })
                    }
                }
            }),
            wx.getSystemInfo({
                success: function(res) {
                    self.globalData.SystemW = res.windowWidth;
                    self.globalData.SystemH = res.windowHeight;
                    let model = res.model.substring(0, res.model.indexOf("X")) + "X";
                    if (model == 'iPhone X') {
                        self.globalData.isIpx = true //判断是否为iPhone X 默认为值false，iPhone X 值为true
                    }
                }
            })
    },


    globalData: {
        userInfo: {
            session_key: null,
            openid: null,
        },
        appId: "1256481996",

        // host: , //阿里云服务器
        // SecretKey: "",
        // SecretId: "",
        isIpx: false,
        SystemW: 0,
        SystemH: 0,
        rotateOpacity: 1, //获取图片之后设置裁剪的透明度，默认可以裁剪
    }
})