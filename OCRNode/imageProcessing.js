const Koa = require('koa');
// const http = require('http');
const crypto = require('crypto');
const { uploadFile } = require('./upload');
const querystring = require('querystring');
const request = require('request');
const fs = require('fs');
const config = require('./config');

var appid = config.txyAppid;
var secretid = config.txySecretId;
var secretkey = config.txySecretKey;

const app = new Koa();


function requestTXService(imagePath) {
    return new Promise(function(resolve) {
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
                // fuc(response.body);
                resolve(body)
            } else {
                console.log(error);
                // fuc(error);
                resolve(error)

            }
        })
    });


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

module.exports = {
    requestTXService,
}