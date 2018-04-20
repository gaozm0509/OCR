//index.js
const app = getApp();
const W = app.globalData.SystemW
const H = app.globalData.SystemH - (app.globalData.isIpx ? 84 : 50)

let cropper = require('../../welCropper/welCropper');

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
        resultData: null
    },

    selectImage: function() {
        var self = this;

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ["original", "compressed"],
            sourceType: ["album"],
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths[0];
                // self.setData({ image: tempFilePaths });
                self.welCropper(tempFilePaths);
            }
        });
    },
    takePhoto: function() {
        var self = this;
        // console.log('userInfo' + app.globalData.userInfo);
        // return;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ["original", "compressed"],
            sourceType: ["camera"],
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths[0];

                self.welCropper(tempFilePaths);
            }
        });
    },

    push: function() {
        var url = '../showResultContent/showResultContent?src=' + this.data.image + '&resutString=' + this.data.resultData;
        // var url = '../photoClipping/photoClipping?src=' + this.data.image + '&resutString=' + this.data.resultData;
        wx.navigateTo({
            url: url,
        })
    },
    welCropper: function(imagePath) {
        var self = this;
        // 将选取图片传入cropper，并显示cropper
        // mode=rectangle 返回图片path
        // mode=quadrangle 返回4个点的坐标，并不返回图片。这个模式需要配合后台使用，用于perspective correction
        var tempFilePath = imagePath;
        let modes = ["rectangle"]
        let mode = modes[0] //rectangle, quadrangle
        self.showCropper({
            src: tempFilePath,
            mode: mode,
            sizeType: ['original', 'compressed'], //'original'(default) | 'compressed'
            callback: (res) => {
                if (mode == 'rectangle') {
                    console.log("crop callback:" + res)
                    self.setData({ image: res });
                    self.uploadImage();
                } else {
                    // wx.showModal({
                    //     title: '',
                    //     content: JSON.stringify(res),
                    // })

                    // console.log(res)
                }

                // that.hideCropper() //隐藏，我在项目里是点击完成就上传，所以如果回调是上传，那么隐藏掉就行了，不用previewImage
            }
        })
    },

    uploadImage: function() {
        wx.showLoading({
            title: '图片处理中...',
        });
        var self = this;
        wx.uploadFile({
            url: app.globalData.host + 'upload',
            filePath: self.data.image,
            name: self.data.imageName,
            header: {
                "Content-Type": "multipart/form-data",
            },
            success: function(res) {
                console.log(res);
                var jsonData = res.data;
                var obj = JSON.parse(jsonData);
                var resultArray = obj.data.items;
                var resutString = '';
                for (var i = 0; i < resultArray.length; i++) {
                    var itmeString = resultArray[i].itemstring + '\n';
                    resutString = resutString + itmeString;
                }
                self.setData({
                    resultData: resutString,
                });
                // 返回数据隐藏loading
                wx.hideLoading();
                self.hideCropper()
                self.push();
            },
            fail: function(res) {
                // 返回数据隐藏loading
                wx.hideLoading();
                console.log(res);
            },
            complete: function(res) {
                wx.hideLoading();
            }
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
        var self = this
            // 初始化组件数据和绑定事件
        cropper.init.apply(self, [W, H]);
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