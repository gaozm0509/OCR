const Koa = require('koa');
// const http = require('http');
const crypto = require('crypto');
const path = require('path');
const { uploadFile } = require('./upload');
const querystring = require('querystring');
const request = require('request');
const fs = require('fs');


var appid = "1256481996";
var secretid = "AKIDnT5znT3PehYFj1u22xn04ziIhvxpeNrA";
var secretkey = "HNI2axCHRbdT7Y5XotnUmw1ylRCmA2jl";

const app = new Koa();

app.use(async ctx => {
    // console.log("ctx.url:" + ctx.url);
    // console.log("ctx.url:" + ctx.method);
    if (ctx.url === '/' && ctx.method === 'GET') {
        // 当GET请求时候返回表单页面
        let html = `
          <h1>koa2 upload demo</h1>
          <form method="POST" action="/upload.json" enctype="multipart/form-data">
            <p>file upload</p>
            <span>picName:</span><input name="picName" type="text" /><br/>
            <input name="file" type="file" /><br/><br/>
            <button type="submit">submit</button>
          </form>
        `
        ctx.body = html

    } else if (ctx.url === '/upload.js' && ctx.method === 'POST') {
        // 上传文件请求处理
        let result = { success: false }
        let serverFilePath = path.join(__dirname, 'upload-files')

        // 上传文件事件
        result = await uploadFile(ctx, {
                fileType: 'album',
                path: serverFilePath
            })
            // console.log("path:" + result.imagePath);
            // ctx.body = result

        // 异步
        await new Promise((resolve) => {
            requestTXService(result.imagePath, function(analysisResult) {
                // 返回analysisResult
                // 获取成功后删除图片
                fs.unlinkSync(result.imagePath)
                    // console.log("analysisResult:" + analysisResult)
                ctx.body = analysisResult;
                resolve();
            });
        });
    } else {
        // 其他请求显示404
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
    }
});


function requestTXService(imagePath, fuc) {
    var url = "http://recognition.image.myqcloud.com/ocr/general"
    var formData = {
        image: fs.createReadStream(imagePath),
        bucket: "gzmBucket",
        appid: appid,

    };
    var headers = {
        host: "recognition.image.myqcloud.com",
        authorization: getSign(imagePath),
    };
    request.post({ url: url, headers: headers, formData: formData }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log("body:" + body);
            fuc(response.body);
        } else {
            console.log(error);
            fuc(error);

        }
    })

}



function getSign(imagePath) {
    var folder = "folderName"
    var random = Math.floor(Math.random() * 10000);
    var cTime = parseInt(Date.now() / 1000);
    var folder = "imageName";
    var bucket = "gzmBucket";
    var fileid = encodeURIComponent('/' + appid + '/' + bucket + '/' + folder)
    var plainText = "a=" + appid + "&b=" + bucket + "&k=" + secretid + "&e=" + (cTime + 1000000) + "&t=" + cTime + "&r=" + random + "&u=0" + "&f=" + fileid;
    // 每个字段具体格式查看文档：https://www.qcloud.com/document/product/436/6054
    // var plainText = 'a=' + appid + '&k=' + secretID + '&e=' + expiredTime + '&t=' + currentTime + '&r=' + rand + '&f=' + fileid + '&b=' + bucket;
    var data = new Buffer(plainText, 'utf8');
    var resStr = crypto.createHmac('sha1', secretkey).update(data).digest();
    var bin = Buffer.concat([resStr, data]);
    var sign = bin.toString('base64');

    return sign;
}

app.listen(3000)