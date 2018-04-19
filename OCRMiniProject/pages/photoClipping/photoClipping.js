var app = getApp()
    // 获取显示区域长宽
const device = wx.getSystemInfoSync()
const W = device.windowWidth
const H = device.windowHeight - 50

let cropper = require('../../welCropper/welCropper');

console.log(device)

Page({
    data: {},
    onLoad: function() {
        var that = this
            // 初始化组件数据和绑定事件
        cropper.init.apply(that, [W, H]);
    },
    selectTap: function() {
        var that = this

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const tempFilePath = res.tempFilePaths[0]
                console.log(tempFilePath)

                // 将选取图片传入cropper，并显示cropper
                // mode=rectangle 返回图片path
                // mode=quadrangle 返回4个点的坐标，并不返回图片。这个模式需要配合后台使用，用于perspective correction
                let modes = ["rectangle"]
                let mode = modes[0] //rectangle, quadrangle
                that.showCropper({
                    src: tempFilePath,
                    mode: mode,
                    sizeType: ['original'], //'original'(default) | 'compressed'
                    callback: (res) => {
                        if (mode == 'rectangle') {
                            console.log("crop callback:" + res)
                            wx.previewImage({
                                current: '',
                                urls: [res]
                            })
                        } else {
                            wx.showModal({
                                title: '',
                                content: JSON.stringify(res),
                            })

                            console.log(res)
                        }

                        // that.hideCropper() //隐藏，我在项目里是点击完成就上传，所以如果回调是上传，那么隐藏掉就行了，不用previewImage
                    }
                })
            }
        })
    }
})

// Page({
//     data: {
//         stv: {
//             offsetX: 0,
//             offsetY: 0,
//             zoom: false, //是否缩放状态
//             distance: 0, //两指距离
//             scale: 1, //缩放倍数
//         },
//         image: null,
//         resultImage: null, //裁剪之后的image
//         imageModel: 'aspectFit',
//         // bottomCoverMarginTop: -300,
//         topCoverHeight: 300,
//         topCoverTouchPointY: 0,
//         bottomCoverHeight: 300,
//         bottomCoverTouchPointY: 0,
//         windowHeight: 0, //屏幕高度
//     },
//     //事件处理函数
//     touchstartCallback: function(e) {
//         //触摸开始
//         console.log('touchstartCallback');
//         console.log(e);

//         if (e.touches.length === 1) {
//             let { clientX, clientY } = e.touches[0];
//             this.startX = clientX;
//             this.startY = clientY;
//             this.touchStartEvent = e.touches;
//         } else {
//             let xMove = e.touches[1].clientX - e.touches[0].clientX;
//             let yMove = e.touches[1].clientY - e.touches[0].clientY;
//             let distance = Math.sqrt(xMove * xMove + yMove * yMove);
//             this.setData({
//                 'stv.distance': distance,
//                 'stv.zoom': true, //缩放状态
//             })
//         }

//     },
//     touchmoveCallback: function(e) {
//         //触摸移动中
//         //console.log('touchmoveCallback');
//         //console.log(e);

//         if (e.touches.length === 1) {
//             //单指移动
//             if (this.data.stv.zoom) {
//                 //缩放状态，不处理单指
//                 return;
//             }
//             let { clientX, clientY } = e.touches[0];
//             let offsetX = clientX - this.startX;
//             let offsetY = clientY - this.startY;
//             this.startX = clientX;
//             this.startY = clientY;
//             let { stv } = this.data;
//             stv.offsetX += offsetX;
//             stv.offsetY += offsetY;
//             stv.offsetLeftX = -stv.offsetX;
//             stv.offsetLeftY = -stv.offsetLeftY;
//             this.setData({
//                 stv: stv
//             });

//         } else {
//             //双指缩放
//             let xMove = e.touches[1].clientX - e.touches[0].clientX;
//             let yMove = e.touches[1].clientY - e.touches[0].clientY;
//             let distance = Math.sqrt(xMove * xMove + yMove * yMove);

//             let distanceDiff = distance - this.data.stv.distance;
//             let newScale = this.data.stv.scale + 0.005 * distanceDiff;

//             this.setData({
//                 'stv.distance': distance,
//                 'stv.scale': newScale,
//             })
//         }

//     },
//     touchendCallback: function(e) {
//         //触摸结束
//         console.log('touchendCallback');
//         console.log(e);

//         if (e.touches.length === 0) {
//             this.setData({
//                 'stv.zoom': false, //重置缩放状态
//             })
//         }
//     },

//     // 顶部遮罩层操作
//     topCoverTouchstartCallback: function(e) {

//         if (e.touches.length == 1) {
//             // if (this.data.topCoverHeight > (this.data.windowHeight / 2 - 20)) {
//             //     return;
//             // }
//             var clientY = e.touches[0].clientY;
//             console.log('topCoverTouchstartCallback' + clientY);
//             this.setData({ topCoverTouchPointY: clientY });
//         }
//     },
//     topCoverTouchmoveCallback: function(e) {

//         if (e.touches.length == 1) {

//             var clientY = e.touches[0].clientY;
//             console.log('topCoverTouchmoveCallback:' + clientY);
//             var difference = (clientY - this.data.topCoverTouchPointY) / 2;
//             if ((this.data.topCoverHeight > (this.data.windowHeight / 2 - 40)) && (difference > 0)) {
//                 return;
//             }
//             this.setData({ topCoverTouchPointY: this.data.topCoverTouchPointY + difference });
//             this.setData({ topCoverHeight: this.data.topCoverHeight + difference });
//             console.log('topCoverHeight:' + this.data.topCoverHeight);
//         }
//     },
//     topCoverTouchendCallback: function(e) {

//         if (e.touches.length == 1) {
//             var clientY = e.touches[0].clientY;
//             console.log('topCoverTouchmoveCallback:' + clientY);
//             var difference = (clientY - this.data.topCoverTouchPointY) / 2;
//             if ((this.data.topCoverHeight > (this.data.windowHeight / 2 - 40)) && (difference > 0)) {
//                 return;
//             }
//             this.setData({ topCoverTouchPointY: this.data.topCoverTouchPointY + difference });
//             this.setData({ topCoverHeight: this.data.topCoverHeight + difference });
//             console.log('topCoverHeight:' + this.data.topCoverHeight);
//         }
//     },


//     // 底部遮罩层操作
//     bottomCoverTouchstartCallback: function(e) {

//         if (e.touches.length == 1) {

//             var clientY = this.data.windowHeight - e.touches[0].clientY;
//             console.log('bottomCoverTouchstartCallback' + clientY);
//             this.setData({ bottomCoverTouchPointY: clientY });
//         }
//     },
//     bottomCoverTouchmoveCallback: function(e) {
//         if (e.touches.length == 1) {
//             var clientY = this.data.windowHeight - e.touches[0].clientY;
//             console.log('topCoverTouchmoveCallback:' + clientY);
//             var difference = (clientY - this.data.bottomCoverTouchPointY) / 2;
//             if ((this.data.bottomCoverHeight > (this.data.windowHeight / 2 - 40)) && (difference > 0)) {
//                 return;
//             }
//             this.setData({ bottomCoverTouchPointY: this.data.bottomCoverTouchPointY + difference });
//             this.setData({ bottomCoverHeight: this.data.bottomCoverHeight + difference });
//             console.log('bottomCoverHeight:' + this.data.bottomCoverHeight);
//         }
//     },
//     bottomCoverTouchendCallback: function(e) {

//         if (e.touches.length == 1) {
//             var clientY = e.touches[0].clientY;
//             console.log('bottomCoverTouchmoveCallback:' + clientY);
//             var difference = (clientY - this.data.bottomCoverTouchPointY) / 2;
//             if ((this.data.bottomCoverHeight > (this.data.windowHeight / 2 - 40)) && (difference > 0)) {
//                 return;
//             }
//             this.setData({ bottomCoverTouchPointY: this.data.bottomCoverTouchPointY + difference });
//             this.setData({ bottomCoverHeight: this.data.bottomCoverHeight + difference });
//             console.log('bottomCoverHeight:' + this.data.bottomCoverHeight);
//         }
//     },

//     onLoad: function(option) {
//         var self = this;
//         wx.getSystemInfo({
//             success: function(res) {
//                 var wh = res.windowHeight;
//                 var proportion = 2;
//                 if (wh == 504) {
//                     proportion = 2.34;
//                 } else if (wh == 672) {
//                     proportion = 1.81;
//                 }
//                 self.setData({ windowHeight: res.windowHeight * proportion }); // 转化成rpx
//             }
//         })
//         this.setData({
//             image: option.src,

//         })
//     }
// })