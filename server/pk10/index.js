const phantom = require('phantom');
const cheerio = require('cheerio');
const moment = require('moment');

class pksTask {

  constructor() {
    this.isLock = false;
    this.time = 20 * 1000;
    this.intervalId = null;
  }

  /**
   * 初始化配置数据，用于制定采集行为
   */
  static _initData() {
    // 1.采集时间范围

    // 2.期号

  }

  run() {
   let _this = this;

    try {
      _this.intervalId = setInterval(function(){
        if (!_this.isLock) {
          if (false/*时间判断*/) {
            // 不在时间范围内，停止采集
            _this.isLock = true;
            // 调整time
            _this.time = 1000 * 60 * 60;

            return;
          }

          // 真正的运行渠道
          Promise.all([_this.channel1()]).then(result=>{
              // 1.从多渠道中提取出最后一个结果数据，
              // 2.在redis中比较，是否请求collect_api
              console.log('结果是===>',result);
          })
          .catch((err)=>{
            console.log('======',err);
          });

        }
        else {
          if (true/*时间判断*/) {
            // 时间范围内 可以开始采集
            _this.isLock = false;
            // 调整time
            _this.time = 1000 * 20;
          }
        }
      },_this.time);
    } catch (e) {
      console.log('发生了错误',e);
      window.clearInterval(_this.intervalId);
    }

  }

  /**
   * 官方网站 有403
   * http://www.bwlc.net/
   */
  channel1() {
    return new Promise(async function(resolve,reject){
      const instance = await phantom.create();
      console.log('===create')
      try {
        const resultArray = [];
        const page = await instance.createPage();
        await page.on('onResourceRequested', function(requestData) {
          // console.info('Requesting========>', requestData.url);
        });

        const status = await page.open('http://www.bwlc.net/');
        const content = await page.property('content');
        const $ = cheerio.load(content);
        const pksDom = $('div.icon_pk10').parent().parent();
        const issue = pksDom.find('span.ml10').text();
        const codeDoms = pksDom.find('ul.dib').find('li');

        codeArray = [];
        codeDoms.each(function(i,elem) {
          codeArray($(this).text());
        });

        resultArray.push({fullDateNum:issue,data:codeArray.join('-')});

        resolve(resultArray);

      } catch (e) {
        resolve([]);
      } finally {
        await instance.exit();
      }
    });

  }

  /**
   * 未知名 号码是对应的class，需要转换下
   * http://kj.13322.com/pk10_history_dtoday.html
   */
  channel2() {
    return new Promise(async function(resolve,reject){
      const instance = await phantom.create();
      console.log('===create')
      try {
        const resultArray = [];
        const page = await instance.createPage();
        await page.on('onResourceRequested', function(requestData) {
          // console.info('Requesting========>', requestData.url);
        });

        const status = await page.open('http://caipiao.163.com/award/cqssc/');
        const content = await page.property('content');
        const $ = cheerio.load(content);
        const doms = $('td[class=start]');

        for(let attr in doms) {
          let tempObj = doms[attr].attribs;
          if (typeof tempObj !== 'undefined' && typeof tempObj['data-win-number'] != 'undefined')
          {
            // console.log(tempObj['data-period'],tempObj['data-win-number']);
            resultArray.push({fullDateNum: tempObj['data-period'],data:tempObj['data-win-number'].replace(/ /g,'-')});
          }
        }

        resolve(resultArray);

      } catch (e) {
        resolve([]);
      } finally {
        await instance.exit();
      }
    });


  }

  /**
   * 360彩票 存在问题还
   * http://cp.360.cn/ssccq/?menu&r_a=uiaAny
   */
  channel3() {
    return new Promise(async function(resolve,reject){
      const instance = await phantom.create();
      console.log('===create')
      try {
        const resultArray = [];
        const page = await instance.createPage();
        await page.on('onResourceRequested', function(requestData) {
          // console.info('Requesting========>', requestData.url);
        });

        const status = await page.open('http://cp.360.cn/ssccq/?menu&r_a=uiaAny');
        const content = await page.property('content');
        const $ = cheerio.load(content);
        const doms = $('table.mod-kjnum-table').find('tr').find('td');
        // console.log(doms);

        for(let attr in doms) {
          let tempObj = doms[attr].attribs;
          if (typeof tempObj !== 'undefined') console.log(doms[attr].attribs);
          // let tempObj = doms[attr].attribs;
          // if (typeof tempObj !== 'undefined' && typeof tempObj['data-win-number'] != 'undefined')
          // {
          //   // console.log(tempObj['data-period'],tempObj['data-win-number']);
          //   resultArray.push({fullDateNum: tempObj['data-period'],data:tempObj['data-win-number'].replace(/ /g,'-')});
          // }
        }

        resolve(resultArray);

      } catch (e) {
        resolve([]);
      } finally {
        await instance.exit();
      }
    });


  }


}

module.exports = pksTask;
