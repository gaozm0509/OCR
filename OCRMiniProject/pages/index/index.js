//index.js
const app = getApp();

Page({
    data: {
        motto: "Hello World",
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse("button.open-type.getUserInfo"),
        image: null,
        sign: null,
        bucket: "gzmBucket",
        imageName: "gzmImageName",

        resultData: "",
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: "../logs/logs"
        });
    },

    selectImage: function() {
        var self = this;

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ["original", "compressed"],
            sourceType: ["album", "camera"],
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths[0];
                self.setData({ image: tempFilePaths });
                console.log("res = " + res);
                console.log("image src = " + self.data.image);
            }
        });
    },


    uploadImage: function() {
        var self = this;
        wx.uploadFile({
            url: app.globalData.host,
            filePath: self.data.image,
            header: {
                "Content-Type": "multipart/form-data",
            },
            success: function(res) {
                console.log(res);
                var jsonData = res.data;
                var obj = JSON.parse(jsonData);
                var resultArray = obj.data.items;
                var resutString;
                for (var i = 0; i < resultArray.length; i++) {
                    var itmeString = resultArray[i].itemstring;
                    resutString = resutString + itmeString;
                }
                self.setData({
                    resultData: resutString,
                })
            },
            fail: function(res) {
                console.log(res);
            },
            complete: function(res) {}
        });
    },


    onLoad: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
            };
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                }
            });
        }
    },
    getUserInfo: function(e) {
        console.log(e);
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    }
});