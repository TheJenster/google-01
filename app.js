
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var pug = require('pug');
var request = require('request');
const {google} = require('googleapis');
 

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/modules", express.static(path.join(__dirname, 'node_modules')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function logMessage(message) {
  
  console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '[INFO] ' + message);
  
}

function logError(message) {
  
  console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [ERROR] ' + message);
  
}
  
app.get('/', routes.index);

/**
 * Respond to Get Request - Retrieve all Videos
 * 
 * @param {string} filter The URI Filter
 * @param {function} responder The responder to the web application
 * 
 */
app.all('/retrieve', function(req, res, next) {

  callReportServer(res);


});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port: \'' + app.get('port') +'\'');
});

async function callReportServer(res) {

  try {
    const client = await google.auth.getClient({
      keyFile: path.join(__dirname, 'jwt-keys.json'),
      scopes: 'https://www.googleapis.com/auth/analytics.readonly'
    });

    const analyticsreporting = google.analyticsreporting({
      version: 'v4',
      auth: client
    });

    var results = [];

    var googleres = null;

    for (var counter = 0; counter < 28; counter++) {
      googleres = await analyticsreporting.reports.batchGet({
        requestBody: {
          reportRequests: [{
            viewId: '173476706',
            dateRanges: [
              {
                startDate: (counter + 1 )+ "daysAgo",
                endDate: (counter) + "daysAgo"
              },
            ],
          metrics: [
              {expression: 'ga:sessions'},
              {expression: 'ga:pageviews'},
              {expression: 'ga:users'}
            ],
            dimensions: [{name: 'ga:country'}, {name: 'ga:browser'}]
           }]
        }
      });

    results.push(googleres.data);

    console.log('Counter: ' + counter + ' ' + JSON.stringify(googleres.data));
    
    }

    res.send(JSON.stringify(results));

  } catch (e) {
    console.log(e);
  }

}