const phantom = require('phantom');
const cheerio = require('cheerio');
const moment = require('moment');

class cqsscTask {

  constructor() {
    this.isLock = false;
    this.time = 8 * 1000;
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
          Promise.all([_this.channel4()]).then(result=>{
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
   * 官方网站 已测试
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

        const status = await page.open('http://www.cqcp.net/game/ssc/');
        const content = await page.property('content');
        const $ = cheerio.load(content);
        // console.log('result============>',$('#openlist').text())

        const reg = new RegExp(/[1][8]\d{7}(\d-\d-\d-\d-\d)/g);
        const resultText = $('#openlist').text();
        const matchs = resultText.match(reg)
        console.log('======================',moment().format());
        matchs.forEach(function(d){
          let regDate = new RegExp(/[1][8]\d{7}/);
          let regNums = new RegExp(/(\d-\d-\d-\d-\d)/);

          let dateStr = d.match(regDate);
          let numStr = d.match(regNums);
          resultArray.push({fullDateNum:'20' + dateStr[0],data:numStr[0]});
          // console.log(dateStr[0],numStr[0],JSON.stringify(resultArray));
        });

        resolve(resultArray);

      } catch (e) {
        resolve([]);
      } finally {
        await instance.exit();
      }
    });

  }

  /**
   * 网易彩票 已测试
   * http://caipiao.163.com/award/cqssc/
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
            resultArray.push({fullDateNum: '20' + tempObj['data-period'],data:tempObj['data-win-number'].replace(/ /g,'-')});
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
   * 360彩票 已测试
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
        const doms = $('table.mod-kjnum-table').find('tbody').find('td');


        doms.each(function(i,elem) {
          let issue = $(this).children('span').attr('issue');
          let code = $(this).children('em.code').text().split('').join('-');
          if (code) resultArray.push({fullDateNum: issue,data:code});
        });

        resolve(resultArray);

      } catch (e) {
        resolve([]);
      } finally {
        await instance.exit();
      }
    });


  }

  /**
   * 500彩票 未完成
   * http://kaijiang.500.com/static/public/ssc/xml/qihaoxml/20180209.xml?_A=FJDVYHZC1518158660825
   */
   channel4() {
     return new Promise(async function(resolve,reject){
       const instance = await phantom.create();
       console.log('===create')
       try {
         const resultArray = [];
         const page = await instance.createPage();
         await page.on('onResourceRequested', function(requestData) {
           // console.info('Requesting========>', requestData.url);
         });

         const status = await page.open('http://kaijiang.500.com/static/public/ssc/xml/qihaoxml/20180209.xml?_A=FJDVYHZC1518158660825');
         const content = await page.property('content');
         const $ = cheerio.load(content);
         // const doms = $.find('html');
         console.log($('row').find('row')[0]);

         // doms.each(function(i,elem) {
         //   console.log($(this));
         //   // let issue = $(this).children('span').attr('issue');
         //   // let code = $(this).children('em.code').text().split('').join('-');
         //   // if (code) resultArray.push({fullDateNum: issue,data:code});
         // });

         resolve(resultArray);

       } catch (e) {
         resolve([]);
       } finally {
         await instance.exit();
       }
     });


   }

}

module.exports = cqsscTask;
