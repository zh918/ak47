require('./server/common/inject');
const cqssc = require('./server/cqssc');

const c = new cqssc();
c.run();
// 已通
// $Http.post("http://192.168.1.50:7001/api/oauth/token/getAccessToken",{userCode:'admin',password:'admin'}).then(result=>{
//   console.log('结果===》',result);
// });

// setInterval(function(){
//   cqssc();
// },1000 * 15);
