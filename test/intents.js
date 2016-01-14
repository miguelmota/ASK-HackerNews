'use strict';

var test = require('tape');
var intents = require('../libs/intents');

var intent = {};
var session = {};
var response = {
  ask: function(data) {
    console.log('Alexa ASK: ' + data);
  },
  tell: function(data) {
    console.log('Alexa TELL: ' + data);
  }
};

test('intents', function (t) {
  t.plan(0);

  intents.ReadTopStoriesIntent(intent, session, response);
  intents.ReadNewStoriesIntent(intent, session, response);
  intents.ReadJobStoriesIntent(intent, session, response);
  intents.ReadAskStoriesIntent(intent, session, response);
  intents.ReadShowStoriesIntent(intent, session, response);
});

