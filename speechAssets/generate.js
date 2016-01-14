'use strict';

var intentUtteranceExpander = require('intent-utterance-expander');

var intents = {
  ReadTopStoriesIntent: '(|please) (read me|tell me|what\'s|what are|get|get me|fetch|fetch me) the top (|{Count}) (|stories|headlines|news)',
  ReadNewStoriesIntent: '(|please) (read me|tell me|what\'s|what are|get|get me|fetch|fetch me) the (|latest) (|new|newest|recent|most recent) (|{Count}) (|stories|headlines|news)',
  ReadJobStoriesIntent: '(|please) (read me|tell me|what\'s|what are|get|get me|fetch|fetch me) the (|latest) (job|jobs) (|{Count}) (|stories|headlines|news)',
  ReadAskStoriesIntent: '(|please) (read me|tell me|what\'s|what are|get|get me|fetch|fetch me) the (|latest) (ask|ask hn|ask hacker news|questions|answer) (|{Count}) (|stories|headlines|news)',
  ReadShowStoriesIntent: '(|please) (read me|tell me|what\'s|what are|get|get me|fetch|fetch me) the (|latest) (show|show hn|show hacker news|show and tell) (|{Count}) (|stories|headlines|news)'
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
