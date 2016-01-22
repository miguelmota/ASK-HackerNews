'use strict';

var intentUtteranceExpander = require('intent-utterance-expander');

var intents = {
  ReadTopStoriesIntent: '(read|tell|what\'s|what are|get|fetch) top (|{Count}) (|stories|headlines|news)',
  ReadNewStoriesIntent: '(read|tell|what\'s|what are|get|fetch) (|latest) (|latest|new|newest|recent|most recent|current) (|{Count}) (|stories|headlines|news)',
  ReadShowStoriesIntent: '(read|tell me|what\'s|what are|get|fetch) (|latest) (show|show h.n.|show hacker news|show and tell) (|{Count}) (|stories|headlines|news)',
  ReadAskStoriesIntent: '(read|tell|what\'s|what are|get|fetch) (|latest) (ask|ask h.n.|ask hacker news|questions|answer) (|{Count}) (|stories|headlines|news)',
  ReadJobStoriesIntent: '(read|tell|what\'s|what are|get|fetch) (|latest) (job|jobs|career|careers|work) (|{Count}) (|stories|headlines|news)',
  ReadBestStoriesIntent: '(read|tell|what\'s|what are|get|fetch) (|latest) (best|bestest) (|{Count}) (|stories|headlines|news)',
  ReadActiveStoriesIntent: '(read|tell|what\'s|what are|get|fetch) (|latest) (active|most active) (|{Count}) (|stories|headlines|news)',
  ReadNoobStoriesIntent: '(read|tell|what\'s|what are|get|fetch) (|latest) noob (|{Count}) (|stories|headlines|news)'
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
