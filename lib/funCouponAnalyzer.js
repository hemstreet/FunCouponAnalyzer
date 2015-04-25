var fs = require('fs');

var FunCouponAnalyzer = {
    container: '.mcenter article',
    nameSelector: this.container + 'table td:first-of-type a',
    timeSelector: this.container + 'tr:first-of-type td[colspan=2] span',
    contentSelector: this.container + '.KonaBody',
    nextSelector: 'table.text2 td:last-of-type :last-child',
    tickers: {},

    getConfig: function () {
        var config = fs.readFile();
    },

    getName: function(container) {

    },

    runScrape: function (url) {

    }
};