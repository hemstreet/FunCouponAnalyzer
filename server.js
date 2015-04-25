var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    app = express(),
    funCouponAnalyzer = require('./lib/funCouponAnalyzer');


app.get('/v1/scrape/:ticker', function (req, res) {
    var ticker = req.params.ticker;
    funCouponAnalyzer.init(ticker);

    //http://investorshub.advfn.com/boards/read_msg.aspx?message_id=36882799
    //http://investorshub.advfn.com/boards/read_msg.aspx?message_id=113091603

    funCouponAnalyzer.scrapeThread();

    res.send('\nScrape Complete, Check Console!\n\n')
});


var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});