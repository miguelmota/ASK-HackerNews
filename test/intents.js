'use strict';

var test = require('tape');
var intents = require('../libs/intents');

var intent = {};

var session = {
  attributes: {}
};

var response = {
  ask: function(data) {
    console.log('Alexa ASK: ' + data);
  },
  askWithCard: function(data) {
    console.log('Alexa ASK with CARD: ' + data);
  },
  tell: function(data) {
    console.log('Alexa TELL: ' + data);
  },
  tellWithCard: function(data) {
    console.log('Alexa TELL with CARD: ' + data);
  }
};

test('intents', function (t) {
  t.plan(8);

  intents.ReadTopStoriesIntent(intent, session, response).then(callback);
  intents.ReadNewStoriesIntent(intent, session, response).then(callback);
  intents.ReadShowStoriesIntent(intent, session, response).then(callback);
  intents.ReadAskStoriesIntent(intent, session, response).then(callback);
  intents.ReadJobStoriesIntent(intent, session, response).then(callback);
  intents.ReadBestStoriesIntent(intent, session, response).then(callback);
  intents.ReadActiveStoriesIntent(intent, session, response).then(callback);
  intents.ReadNoobStoriesIntent(intent, session, response).then(callback);

  function callback(speech) {
    t.equal(typeof speech, 'string');
  }
});
