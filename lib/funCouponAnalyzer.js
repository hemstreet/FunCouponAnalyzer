var fs = require('fs'),
    cheerio = require('cheerio'),
    request = require('request'),
    sentiment = require('sentiment'),
    twilio = require('twilio'),
    _ = require('underscore'),
    parseString = require('xml2js').parseString;

var funCouponAnalyzer = {
    $: null,
    id: null,
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
    posts: [],
    numbers: null,
    twillio : new twilio.RestClient('ACc555fdfb4994238cefc0a69296cfdf28', '4efd9222381a6286fe186b19d1dbbf6b'),

    init: function (ticker) {

        this.ticker = ticker;

        var mainJson = this.getConfig('main'),
            tickerJson = this.getConfig(ticker, ['tickers']);

        this.base = mainJson.base;
        this.rss = mainJson.rss;
        this.numbers = mainJson.numbers;
        this.postUrl = mainJson.postUrl;

        this.id = tickerJson.id;
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

            if(text) {
                next = funCouponAnalyzer.parseForPostId(text);
            }

        });

        return next;
    },
    getRssFeed: function() {

        //
        var url = this.base + this.rss + this.id,
            posts = null;

        request(url, function (error, response, xml) {
            if (!error) {

                parseString(xml, function(err, result) {
                    posts = result['rss'].channel[0].item;

                    _.each(posts, function(post) {
                        console.log('post', post);
                    })

                });
            }
        });

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
                        //sentiment: sentiment(this.sentimentToSmiley(this.getContent().content))
                    },
                    next = this.getNext();

                this.posts.push(json);

                if (next) {
                    this.scrapeThread(next);
                }
                else
                {
                    this.writePostsToFile(this.ticker);
                }

            }

        }.bind(this));

    },
    parseForPostId: function(text) {

        return text.split('=')[1];

    },

    stripMarkup: function(text) {
        // Strip html tags
        return text.replace(/<(?:.|\n)*?>/gm, '');

    },

    writePostsToFile: function(ticker) {

        //this.sendSMS(ticker + ' scrape has finished');

        fs.writeFile('output/' + ticker + '.json', JSON.stringify(this.posts, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the ' + ticker + '.json file');
        });

    },

    sendSMS: function(msg) {

        _.each(this.numbers, function(number) {
            this.twillio.sms.messages.create({
                to: number,
                from:'+18557818918',
                body: msg
            }, function(error, message) {
                if (!error) {

                    console.log('Success! The SID for this SMS message is:');
                    console.log(message.sid);

                    console.log('Message sent on:');
                    console.log(message.dateCreated);
                } else {
                    console.log('Oops! There was an error.');
                }

                return true;
            });
        }.bind(this));
    }
};

module.exports = funCouponAnalyzer;