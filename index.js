var twilio = require('twilio');
var primality = require('primality');
var countries = require('./countries');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

const accountSid = process.env.TWILIO_AC_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
var client = require('twilio')(accountSid, authToken);

function getRandomInt(min, max) {
  // max and min numst be integers
  return Math.floor(Math.random() * (max - min)) + min;
}

function getPrimePhoneNumbers(isoCountry, areaCode) {

  let promises = [];

  for (let i = 0; i < 20; i++) {
    let twilioPromise = client.availablePhoneNumbers(isoCountry).local.list({
      Contains: getRandomInt(10,99),
      areaCode: areaCode
    });

    console.log(twilioPromise);
    promises.push(twilioPromise);
  }

  let phonePromise = Promise.all(promises);

  let primeNumberPromise = phonePromise.then(data => {
    let verifiedPrimes = [];

    data.forEach(twilioObject => {
      twilioObject.available_phone_numbers.forEach(e => {
        if (primality(e.phone_number.slice(countries[isoCountry].code.length)) && !verifiedPrimes.includes(e.phone_number.slice(countries[isoCountry].code.length))) {
          console.log(e.phone_number);
          e.link = `https://www.twilio.com/console/phone-numbers/search/buy/results?Country=${isoCountry}&searchType=number&searchTerm=${e.friendlyName}`;
          verifiedPrimes.push(e);
        }
      })
    });

    return verifiedPrimes;
  }, reason => {
    console.log(reason);
    return [];
  });

  return primeNumberPromise;
}


app.get('/numbers', (req, res) => {

  let primeNumberPromise = getPrimePhoneNumbers(req.query.isoCountry, req.query.areaCode);

  primeNumberPromise.then(data => {
    res.json({data});
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

var server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening');
})
