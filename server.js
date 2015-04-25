var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var funCouponAnalyzer = require('./lib/funCouponAnalyzer');

app.get('/scrape', function (req, res) {

    //http://investorshub.advfn.com/boards/read_msg.aspx?message_id=36882799
    //http://investorshub.advfn.com/boards/read_msg.aspx?message_id=113091603
    funCouponAnalyzer.runScrape('http://investorshub.advfn.com/boards/read_msg.aspx?message_id=36882799');

    res.send('\nScrape Complete, Check Console!\n\n')

    //var url = 'http://investorshub.advfn.com/boards/read_msg.aspx?message_id=113091603';
    //request(url, function (error, response, html) {
    //    if (!error) {
    //
    //        var x = 0,
    //            limit = 25;
    //        do {
    //
    //            funCouponAnalyzer.loadHtml(html);
    //
    //            var json = {
    //                    name: funCouponAnalyzer.getName(),
    //                    time: funCouponAnalyzer.getTime(),
    //                    content: funCouponAnalyzer.getContent()
    //                },
    //                next = funCouponAnalyzer.getNext();
    //
    //            console.log(next);
    //            if (next) {
    //                console.log('has next');
    //
    //            }
    //            x++;
    //
    //        } while (x < limit);
    //    }
    //
    //    fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
    //        console.log('File successfully written! - Check your project directory for the output.json file');
    //    });
    //
    //    res.send('\nCheck your console!\n\n')
    //});
});


var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});