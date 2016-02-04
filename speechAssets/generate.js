'use strict';

var intentUtteranceExpander = require('intent-utterance-expander');

var intents = {
  ReadTopStoriesIntent: [
    '(read|tell|what\'s|what are|get|get me|fetch) top (|{Count}) (|stories|headlines|news)',
    'top (stories|headlines)'
  ],
  ReadNewStoriesIntent: [
    '(read|tell|what\'s|what are|get|get me|fetch) (|latest) (|latest|new|newest|recent|most recent|current) (|{Count}) (|stories|headlines|news)',
    'new (stories|headlines)',
    'what the latest news is'
  ],
  ReadShowStoriesIntent: [
    '(read|tell me|what\'s|what are|get|get me|fetch) (|latest) (show|show hacker news|show and tell) (|{Count}) (|stories|headlines|news)',
    'show (stories|headlines)'
  ],
  ReadAskStoriesIntent: [
    '(read|tell|what\'s|what are|get|get me|fetch) (|latest) (ask|ask hacker news|questions|answer) (|{Count}) (|stories|headlines|news)',
    'ask (stories|headlines)'
  ],
  ReadJobStoriesIntent: [
    '(read|tell|what\'s|what are|get|get me|fetch) (|latest) (job|jobs|career|careers|work) (|{Count}) (|stories|headlines|news)',
    'job (stories|headlines)'
  ],
  ReadBestStoriesIntent: [
    '(read|tell|what\'s|what are|get|get me|fetch) (|latest) (best|bestest) (|{Count}) (|stories|headlines|news)',
    'best (stories|headlines)'
  ],
  ReadActiveStoriesIntent: [
    '(read|tell|what\'s|what are|get|get me|fetch) (|latest) (active|most active) (|{Count}) (|stories|headlines|news)',
    'active (stories|headlines)'
  ],
  ReadNoobStoriesIntent: [
    '(read|tell|what\'s|what are|get|get me|fetch) (|latest) noob (|{Count}) (|stories|headlines|news)',
    'active (stories|headlines)'
  ]
};

var utterancesCollection = '';

for (var intent in intents) {
  var lines = intents[intent];
  if (Array.isArray(lines)) {
    var collection = lines.map(function(line) {
      return expand(intent, line);
    });

    utterancesCollection += (collection.join('') + '\n');
  } else if (typeof lines === 'string') {
    utterancesCollection += (expand(intent, lines) + '\n');
  }
}

function expand(intent, line) {
  var intentUtterances = intentUtteranceExpander(line).reduce(function(intentUtterance, phrase) {
    var utterance = intent + ' ' + phrase;
    return intentUtterance += (utterance + '\n');
  }, '');

  return intentUtterances;
}

console.log(utterancesCollection);
