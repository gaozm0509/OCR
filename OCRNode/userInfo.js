const Koa = require('koa');
const request = require('request');
const config = require('./config');
const app = new Koa();

function requestWxInfo(jscode, callBack) {
    var url = 'https: //api.weixin.qq.com/sns/jscode2session?appid=' + config.AppId + '&secret=' + config.Secret + '&js_code=' + jscode + '&grant_type=authorization_code';
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // 打印google首页
            callBack(body);
        } else {
            console.log(response);
            console.log(error);
        }
    })
}

function requestWxInfoAsync(jscode) {
    return new Promise(function(resolve) {
        // var url='https://api.weixin.qq.com/sns/jscode2session?appid=wxed6fe423911ded6c&secret=0670eb450e23d8eff031dec5efbfc547&js_code=061QdRw32raHiM0XZIx32L53x32QdRwv&grant_type=authorization_code'
        var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + config.AppId + '&secret=' + config.wxSecret + '&js_code=' + jscode + '&grant_type=authorization_code';
        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // 打印google首页
                resolve(body);
            } else {
                if (error == undefined) {
                    resolve(body);
                } else {
                    resolve(error);
                }
            }
        })
    });

}

// export {

// };
module.exports = {
    requestWxInfo,
    requestWxInfoAsync
}