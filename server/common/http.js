const http = require('http');
const querystring = require('querystring');
const url = require('url');

class Http {

  /**
   * 发起post请求
   */
  static post(urls,parms,headers={}) {
    return new Promise(function(resolve,reject){
      const buffers = [];
      // 1.解析url
      const urlObj = url.parse(urls);

      // 2.处理参数
      const postData = querystring.stringify(parms);

      // 3.header处理
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      // 请求
      const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          buffers.push(chunk);
        });
        res.on('end', () => {
          var result = JSON.parse(buffers.join());
          resolve(result);
        });
      });

      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });

      // write data to request body
      req.write(postData);
      req.end();

    });
  }
}

if (typeof global.$Http === 'undefined') global.$Http = Http;
