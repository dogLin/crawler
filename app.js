var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();

/**
 * 转码&#x开头的
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function decode(text){
    return unescape(text.replace(/&#x/g,"%u").replace(/;/g,'').replace(/%uA0/g,' '))
}

app.get('/', function (req, res, next) {
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get('www.ftchinese.com/channel/china.html')
  .set("Content-Type","text/html;charset=utf-8")
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items = [];
      $('.item-inner').each(function (idx, element) {
        var $element = $(element);
        items.push({
          title: decode($element.find("a").html()),
          href:'www.ftchinese.com' + $element.find('a').attr('href'),
          image:$element.find('figure').attr('data-url'),
          time:decode($element.find('.item-time').html())
        });
        console.log(decode($element.find("a").html()));
      });

      res.send(items);
    });
});

app.listen(3001,function(){
    console.log('app is listening at port 3001');
})
