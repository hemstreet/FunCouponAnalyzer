var fs = require('fs'),
    cheerio = require('cheerio'),
    request = require('request'),
    sentiment = require('sentiment');

var funCouponAnalyzer = {
    $: null,
    key: null,
    last: null,
    base: null,
    postUrl: null,
    start: null,
    users: null,
    ticker: null,
    nameSelector: '.mcenter article table td:first-of-type a',
    timeSelector: '.mcenter article tr:first-of-type td[colspan=2] span',
    nextSelector: 'table.text2 td:last-of-type :last-child',
    contentSelector: '.mcenter article .KonaBody',


    init: function (ticker) {
        
        this.ticker = ticker;

        var mainJson = this.getConfig('main'),
            tickerJson = this.getConfig(ticker, ['tickers']);

        this.base = mainJson.base;
        this.postUrl = mainJson.postUrl;

        this.key = tickerJson.key;
        this.start = tickerJson.last || tickerJson.start;

    },
    getConfig: function (name, _path) {

        var path = '';

        if (_path !== undefined) {
            path = _path.join('/') + '/';
        }

        var contents = fs.readFileSync('config/' + path + name + '.json'),
            parsed = JSON.parse(contents);

        return parsed;

    },

    loadHtml: function (html) {
        this.$ = cheerio.load(html);
    },
    getName: function () {

        var name = 'No Name Found';

        this.$(this.nameSelector).filter(function () {
            var data = funCouponAnalyzer.$(this);
            name = data[0].children[0].data;

        });

        return name;

    },
    getTime: function () {

        var time = 'No Time Found';

        this.$(this.timeSelector).filter(function () {
            var data = funCouponAnalyzer.$(this);
            time = data[0].children[0].data;
        });

        return time;
    },
    getContent: function () {

        var content = 'No Content Found';

        this.$(this.contentSelector).filter(function () {
            var data = funCouponAnalyzer.$(this);
            content = funCouponAnalyzer.stripMarkup(data.html());

        });

        return content;
    },

    getNext: function () {

        var next = null;

        this.$(this.nextSelector).filter(function () {
            var data = funCouponAnalyzer.$(this);

            var text = data[0].attribs.href;

            next = funCouponAnalyzer.parseForPostId(text);

        });

        return next;
    },
    scrapeThread: function (_next) {

        var next = _next || this.start,
            url = this.base + this.postUrl + next;

        request(url, function (error, response, html) {
            if (!error) {

                funCouponAnalyzer.loadHtml(html);

                var json = {
                        name: this.getName(),
                        time: this.getTime(),
                        content: this.getContent()
                    },
                    next = this.getNext();

                var results = sentiment(json.content);

                // Tmp sentiment to smiley function
                console.log(this.sentimentToSmiley(results), '\n', json.content, '\n\n');

                if (next) {
                    this.scrapeThread(next);
                }

            }

            //fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            //    console.log('File successfully written! - Check your project directory for the output.json file');
            //});

        }.bind(this));
    },
    parseForPostId: function(text) {

        return text.split('=')[1];

    },

    stripMarkup: function(text) {
        return text.replace(/<(?:.|\n)*?>/gm, '');

    },

    /**
     * tmp function
     * @param text
     * @returns {*}
     */
    sentimentToSmiley: function (text) {
        var score = sentiment.score;

        if (score === 0) {
            return ':-|'
        }
        if (score < 0) {
            if (score > -2) {
                return ':-('
            }
            return ':`('
        }

        if (score < 2) {
            return ':-)'
        }
        return ':-D'
    }
};

module.exports = funCouponAnalyzer;