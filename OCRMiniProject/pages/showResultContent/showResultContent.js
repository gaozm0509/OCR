//logs.js

Page({
    data: {
        src: null,
        textarea: null,
        imageModel: 'aspectFit',
        resutString: null,
    },
    onLoad: function(option) {
        this.setData({ src: option.src })
        this.setData({ resutString: option.resutString })
        console.log("resutString=" + this.data.resutString);
    },

    // 获取到的内容复制到剪切板
    copy: function() {
        var self = this;
        wx.setClipboardData({
            data: self.data.resutString,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                                title: '已复制',
                                duration: 2000
                            })
                            // console.log(res.data) // data
                    }
                })
            }
        })
    },
    // 查看图片
    imageTap: function() {
        var self = this;
        wx.previewImage({
            // current: current, // 当前显示图片的http链接  
            urls: [self.data.src] // 需要预览的图片http链接列表  
        })
    }
})