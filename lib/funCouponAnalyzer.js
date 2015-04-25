var cheerio = require('cheerio'),
    request = require('request');

var funCouponAnalyzer = {
    nameSelector: '.mcenter article table td:first-of-type a',
    timeSelector: '.mcenter article tr:first-of-type td[colspan=2] span',
    contentSelector: '.mcenter article .KonaBody',
    nextSelector: 'table.text2 td:last-of-type :last-child',
    tickers: {},
    $ : null,

    getConfig: function () {
        var config = fs.readFile();
    },

    loadHtml : function(html) {
        this.$ = cheerio.load(html);
    },
    getName: function() {

        var name = 'No Name Found';

        this.$(this.nameSelector).filter(function () {
            var data = funCouponAnalyzer.$(this);
            name = data[0].children[0].data;

        });

        return name;

    },
    getTime: function() {

        var time = 'No Time Found';

        this.$(this.timeSelector).filter(function () {
            var data = funCouponAnalyzer.$(this);
            time = data[0].children[0].data;
        });

        return time;
    },
    getContent: function() {

        var content = 'No Content Found';

        this.$(this.contentSelector).filter(function () {
            var data = funCouponAnalyzer.$(this);
            content = data.html();

        });

        return content;
    },

    getNext: function() {

        var next = null;

        this.$(this.nextSelector).filter(function () {
            var data = funCouponAnalyzer.$(this);

            next = data[0].attribs.href;

        });

        return next;
    },
    runScrape: function (url) {
        request(url, function (error, response, html) {
            if (!error) {

                console.log('running scrape');

                funCouponAnalyzer.loadHtml(html);

                var json = {
                        name: funCouponAnalyzer.getName(),
                        time: funCouponAnalyzer.getTime(),
                        content: funCouponAnalyzer.getContent()
                    },
                    next = funCouponAnalyzer.getNext();

                console.log(json.name, json.time, 'next =', funCouponAnalyzer.getNext());

                if(next) {
                    funCouponAnalyzer.runScrape('http://investorshub.advfn.com/boards/' + next);
                }

            }

            //fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            //    console.log('File successfully written! - Check your project directory for the output.json file');
            //});

        });
    }
};

module.exports = funCouponAnalyzer;