var cheerio = require('cheerio');

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
        fs.readFile('../tmp.html', function (err, data) {
            if (err) throw err;
            return data;
        });
    },
    parseScrape: function(html) {

        console.log('parse scrape');
    }
};

module.exports = funCouponAnalyzer;