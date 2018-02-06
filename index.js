const cqssc = require('./server/cqssc');


setInterval(function(){
  cqssc();
},1000 * 15);
