const phantom = require('phantom');
const cheerio = require('cheerio');
const moment = require('moment');

class cqsscTask {
  // isLock:true表示锁定不能进行，false表示未锁定
  // static const isLock = false;
  // static const time = 60;
  // static const intervalId = null;

  constructor() {
    this.isLock = false;
    this.time = 5 * 1000;
    this.intervalId = null;
  }

  /**
   * 初始化配置数据，用于制定采集行为
   */
  static _initData() {
    // 1.采集时间范围

    // 2.期号

  }

  async run() {
    try {
      this.intervalId = setInterval(function(){
        if (!this.isLock) {
          if (false/*时间判断*/) {
            // 不在时间范围内，停止采集
            this.isLock = true;
            // 调整time
            this.time = 1000 * 60 * 60;

            return;
          }

          // 真正的运行渠道
          // const channel1Result = this.channel1();
          // const channel2Result = this.channel2();
          console.log('============')
          Promise.all([this.channel1,this.channel2]).then(result=>{
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
            this.isLock = false;
            // 调整time
            this.time = 1000 * 15;
          }
        }
      },this.time);
    } catch (e) {
      console.log('发生了错误',e);
      window.clearInterval(this.intervalId);
    }

  }

  /**
   * 官方网站
   */
  async channel1() {
    return new Promise(async function(resolve,reject){
      const instance = await phantom.create();

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
          resultArray.push({fullDateNum:dateStr[0],data:numStr[0].split('-')});
          console.log(dateStr[0],numStr[0],JSON.stringify(resultArray));
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
   * 其它渠道
   */
  static async channel2() {
    return new Promise(function(resolve,reject){
      try {

        resolve([5,5,5]);
      } catch (e) {
        resolve([]);
      } finally {

      }
    });

  }

}

module.exports = cqsscTask;
