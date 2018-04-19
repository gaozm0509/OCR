const Koa = require('koa');
const request = require('request');
const koa_router = require('koa-router');
const path = require('path');
const { uploadFile } = require('./upload');

const userInfo = require('./userInfo');
const imageProcessing = require('./imageProcessing');
const config = require('./config');
const fs = require('fs');

const app = new Koa();

const router = new koa_router();

// 接收上传到服务器的图片，然后传给腾讯OCR，返回处理后的文字
router.post('/upload', async ctx => {
    // 上传文件请求处理
    let result = { success: false }
    let serverFilePath = path.join(__dirname, 'upload-files')

    // 上传文件事件
    result = await uploadFile(ctx, {
            fileType: 'album',
            path: serverFilePath
        })
        // // 异步
    var body = await imageProcessing.requestTXService(result.imagePath);
    fs.unlink(result.imagePath);
    ctx.body = body;
});
router.get('/imageProcessing', async ctx => {

});

// 接收上传的code，返回userinfo相关
router.get('/userInfo', async(ctx) => {
    var body = await userInfo.requestWxInfoAsync(ctx.query.code);
    ctx.body = body;
});



app.use(router.routes());

app.listen(3000, () => {
    console.log('服务器启动')
});