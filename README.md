<p align="center">
  <img src="/media/images/logo.png" alt="Fun Coupon Analyzer"/>
</p>

Description
===

The framework required for obtaining and manipulating stock market data. It's sole purpose is to look for content 
written about stock tickers. It then determines the overall sentiment towards the company as well as suggesting 
potential upcoming investment opportunities.

Cool, but [how does it work?](#how-it-works)

Setup
====

Run the following commands in the root of the project, Ensure node and gulp is installed.
Don't have it or not sure? 

* [Node Download](https://nodejs.org/download/)
* [gulp npm](https://www.npmjs.com/package/gulp-install), Don't have time to read? Run this in the command line `npm install --save gulp-install`

```
$ npm install
$ gulp
```

<a name="how-it-works"></a>how does it work?
===

* Running gulp will run and set up a local web server located at `http://localhost:3000`. This is where we will be basing
all of our routes on.

* `server.json` is our main file, it's where the magic happens. The sole purpose of this file is to set up actions to run
when certain urls are hit. Our example of `/v1/scrape/{{ticker}}` ex. `http://localhost:3000/v1/scrape/mjna`

* After we have navigated to that url, we can see inside the function that we call  `funCouponAnalyzer.init(ticker)`, 
the ticker variable was passed as the third segment of the url ( in our case that is MJNA ). After we call init we are now 
at the fun part. We load a json config file located at `config/tickers/mjna.json`, notice the file is named the same as our ticker.
Coincidence? I think not, This is where we store our ticker specific content. 

* After we load our config for the specific ticker as well as our base config file, we are now able to run a scrape 
`funCouponAnalyzer.scrapeThread()` which loads in our base url we set in our ticker config. Scrapes the page, traverses the dom and
populates a json object with our results. We also run the content we pulled through a sentiment analysis library.
We then look for the next button and check to see if it is a link. If it is a link we know that we are not on the last page 
of the forum and we need to continue going until we turn blue in the face or we get to the end! ( I'm glad we don't have to do this
manually )

Routes
===
`/v1/scrape/{{ticker}}`


Chart 
* http://d3js.org/

String time to timestamp 
* http://stackoverflow.com/questions/11172568/javascript-converting-human-time-to-timestamp

Logo by m. turan ercan from the Noun Project